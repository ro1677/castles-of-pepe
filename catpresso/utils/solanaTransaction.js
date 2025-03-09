import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createTransferInstruction,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

// ✅ 사용할 RPC 엔드포인트 (Helius, QuickNode, Solana 공식 RPC 순차적 로드 밸런싱)
const RPC_ENDPOINTS = [
  "https://api.helius.xyz/v0/transactions/?api-key=7deed438-4fbd-45e0-a163-13fd3e424e72", // Helius
  "https://warmhearted-nameless-market.solana-mainnet.quiknode.pro/7a1a6d3984b419692bbfab65161c9fb424e5a01b/", // QuickNode
  "https://api.mainnet-beta.solana.com", // Solana 공식 RPC
];

let rpcIndex = 0;

// ✅ RPC 자동 전환 함수
const getConnection = () => {
  const rpcUrl = RPC_ENDPOINTS[rpcIndex];
  console.log(`🔄 사용 중인 RPC: ${rpcUrl}`);
  return new Connection(rpcUrl, "confirmed");
};

// ✅ 프리세일 결제 계정 (SOL 결제 받는 계정)
const PRESALE_ACCOUNT = new PublicKey("7BWDh2smvixYi5iup7h4oaA5VXtaVi6hmDGkgoooEfHi");

// ✅ 캣프레소 토큰 민트 주소 (SPL 토큰 전송에 필요)
const CATPRESSO_TOKEN_MINT = new PublicKey("GvxpqNTXmVUCH2RxHRpsacwtUMAuxJNuqV7D4S42UbPm");

// ✅ 프리세일 참여자에게 토큰을 지급할 계정 (현재 소유자)
const PRESALE_TOKEN_OWNER = new PublicKey("A7oYVN5JDkS7vdgiT8TsGHNJvPVVQBszr4S46GZ6LDfp");

// ✅ 현재 지갑 SOL 잔액 조회 함수 (RPC 로드 밸런싱 적용)
export const getWalletBalance = async (walletAddress) => {
  try {
    if (!walletAddress) throw new Error("🚨 지갑이 연결되지 않았습니다.");

    // PublicKey 변환
    const key = walletAddress instanceof PublicKey ? walletAddress : new PublicKey(walletAddress);
    console.log("지갑 잔액 조회 - 주소:", key.toString());

    let balance;
    for (let i = 0; i < RPC_ENDPOINTS.length; i++) {
      try {
        balance = await getConnection().getBalance(key, "confirmed");
        return balance / 10 ** 9; // lamports → SOL 변환
      } catch (error) {
        console.error("❌ RPC 오류 발생, 다른 RPC로 재시도:", error);
        rpcIndex = (rpcIndex + 1) % RPC_ENDPOINTS.length;
        await new Promise((resolve) => setTimeout(resolve, 300)); // ⏳ Rate Limit 방지 (300ms 대기)
      }
    }
    throw new Error("❌ 모든 RPC에서 SOL 잔액 조회 실패");
  } catch (error) {
    console.error("❌ SOL 잔액 조회 실패:", error);
    return 0;
  }
};

// ✅ SOL + SPL 토큰 전송 트랜잭션 실행 함수 (RPC 로드 밸런싱 적용)
export const purchasePresaleToken = async (wallet, amount, TOKEN_PRICE_SOL) => {
  try {
    if (!wallet || !wallet.publicKey) throw new Error("❌ 지갑이 연결되지 않았습니다.");

    // ✅ SOL 전송 금액 계산 (lamports 단위)
    const totalCost = Math.round(amount * TOKEN_PRICE_SOL * 10 ** 9);

    // ✅ 사용자의 SPL 토큰 계정 (없으면 생성 필요)
    const userTokenAccount = await getAssociatedTokenAddress(
      CATPRESSO_TOKEN_MINT,
      wallet.publicKey
    );

    // ✅ 프리세일 소유자의 SPL 토큰 계정
    const presaleTokenAccount = await getAssociatedTokenAddress(
      CATPRESSO_TOKEN_MINT,
      PRESALE_TOKEN_OWNER
    );

    // ✅ 트랜잭션 생성 (SOL 전송)
    let transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: PRESALE_ACCOUNT,
        lamports: totalCost,
      })
    );

    // ✅ SPL 토큰 전송 트랜잭션 추가
    transaction.add(
      createTransferInstruction(
        presaleTokenAccount, // 프리세일 토큰 보유 계정 (출발)
        userTokenAccount, // 구매자 토큰 계정 (도착)
        PRESALE_TOKEN_OWNER, // 권한자 (프리세일 운영자)
        amount * 10 ** 9, // 전송할 토큰 양 (DECIMALS = 9)
        [],
        TOKEN_PROGRAM_ID
      )
    );

    // ✅ 최근 블록 해시 가져오기 및 수수료 납부자 지정
    transaction.recentBlockhash = (await getConnection().getLatestBlockhash("confirmed")).blockhash;
    transaction.feePayer = wallet.publicKey;

    // ✅ 지갑에서 트랜잭션 서명 요청
    const signedTransaction = await wallet.signTransaction(transaction);

    // ✅ 트랜잭션 전송 (RPC 장애 대비, 실패 시 다른 RPC로 재시도)
    for (let i = 0; i < RPC_ENDPOINTS.length; i++) {
      try {
        const signature = await getConnection().sendRawTransaction(
          signedTransaction.serialize(),
          { skipPreflight: false, preflightCommitment: "confirmed" }
        );
        console.log("✅ 트랜잭션 성공:", signature);
        return signature;
      } catch (error) {
        console.error("❌ 트랜잭션 실패, 다른 RPC로 재시도:", error);
        rpcIndex = (rpcIndex + 1) % RPC_ENDPOINTS.length;
        await new Promise((resolve) => setTimeout(resolve, 300)); // ⏳ Rate Limit 방지
      }
    }
    throw new Error("❌ 모든 RPC에서 트랜잭션 실패");
  } catch (error) {
    console.error("❌ 트랜잭션 실패:", error);
    throw error;
  }
};

