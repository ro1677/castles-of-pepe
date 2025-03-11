// ✅ utils/solanaTransaction.js
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

const RPC_ENDPOINTS = [
  "https://warmhearted-nameless-market.solana-mainnet.quiknode.pro/7a1a6d3984b419692bbfab65161c9fb424e5a01b/",
  "https://api.mainnet-beta.solana.com",
];

let rpcIndex = 0;

const getConnection = () => {
  const rpcUrl = RPC_ENDPOINTS[rpcIndex % RPC_ENDPOINTS.length];
  console.log(`🔄 현재 RPC: ${rpcUrl}`);
  return new Connection(rpcUrl, "confirmed");
};

// ✅ SOL 잔액 조회 함수
export const getWalletBalance = async (walletAddress) => {
  if (!walletAddress) throw new Error("🚨 지갑이 연결되지 않았습니다.");

  const key =
    walletAddress instanceof PublicKey
      ? walletAddress
      : new PublicKey(walletAddress);
  console.log("✅ 지갑 주소:", key.toString());

  for (let attempt = 0; attempt < RPC_ENDPOINTS.length; attempt++) {
    try {
      const connection = getConnection();
      const balance = await connection.getBalance(key, "confirmed");
      return balance / 10 ** 9;
    } catch (error) {
      console.error("❌ RPC 오류, 다른 RPC로 재시도:", error);
      rpcIndex = (rpcIndex + 1) % RPC_ENDPOINTS.length;
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  throw new Error("❌ 모든 RPC에서 SOL 잔액 조회 실패");
};

// ✅ 트랜잭션 전송 함수 (purchasePresaleToken)
export const purchasePresaleToken = async (wallet, amount, TOKEN_PRICE_SOL) => {
  if (!wallet || !wallet.publicKey || !wallet.signTransaction)
    throw new Error("❌ 지갑 연결 또는 서명 함수가 없습니다.");

  const totalCost = Math.round(amount * TOKEN_PRICE_SOL * 10 ** 9);
  const connection = getConnection();

  const CATPRESSO_TOKEN_MINT = new PublicKey(
    "GvxpqNTXmVUCH2RxHRpsacwtUMAuxJNuqV7D4S42UbPm"
  );
  const PRESALE_ACCOUNT = new PublicKey(
    "7BWDh2smvixYi5iup7h4oaA5VXtaVi6hmDGkgoooEfHi"
  );
  const PRESALE_TOKEN_OWNER = new PublicKey(
    "A7oYVN5JDkS7vdgiT8TsGHNJvPVVQBszr4S46GZ6LDfp"
  );

  // 사용자의 토큰 계좌 (사용자 지갑 소유)
  const userTokenAccount = await getAssociatedTokenAddress(
    CATPRESSO_TOKEN_MINT,
    wallet.publicKey
  );

  // presale 토큰 계좌 (프리세일 토큰을 보관하는 계좌)
  const presaleTokenAccount = await getAssociatedTokenAddress(
    CATPRESSO_TOKEN_MINT,
    PRESALE_TOKEN_OWNER
  );

  let transaction = new Transaction().add(
    // SOL 결제: 사용자가 PRESALE_ACCOUNT으로 SOL 전송
    SystemProgram.transfer({
      fromPubkey: wallet.publicKey,
      toPubkey: PRESALE_ACCOUNT,
      lamports: totalCost,
    }),
    // 토큰 전송: presaleTokenAccount → userTokenAccount  
    // ✅ authority를 PRESALE_TOKEN_OWNER에서 wallet.publicKey로 변경하여 사용자가 직접 서명하도록 함
    createTransferInstruction(
      presaleTokenAccount,
      userTokenAccount,
      wallet.publicKey,
      amount * 10 ** 9,
      [],
      TOKEN_PROGRAM_ID
    )
  );

  // 최신 블록 해시를 갱신하여 거래 만료를 방지
  transaction.recentBlockhash = (
    await connection.getLatestBlockhash()
  ).blockhash;
  transaction.feePayer = wallet.publicKey;

  const signedTransaction = await wallet.signTransaction(transaction);

  for (let i = 0; i < RPC_ENDPOINTS.length; i++) {
    try {
      const signature = await getConnection().sendRawTransaction(
        signedTransaction.serialize(),
        {
          skipPreflight: false,
          preflightCommitment: "confirmed",
        }
      );
      console.log("✅ 트랜잭션 성공:", signature);
      return signature;
    } catch (error) {
      console.error("❌ 트랜잭션 실패, 다른 RPC로 재시도:", error);
      rpcIndex = (rpcIndex + 1) % RPC_ENDPOINTS.length;
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  throw new Error("❌ 모든 RPC에서 트랜잭션 실패");
};

// ✅ 새로 추가된 함수: 서명된 트랜잭션을 제출하는 함수
export const sendSignedTransaction = async (signedTransaction) => {
  for (let i = 0; i < RPC_ENDPOINTS.length; i++) {
    try {
      const connection = getConnection();
      const signature = await connection.sendRawTransaction(
        signedTransaction.serialize(),
        {
          skipPreflight: false,
          preflightCommitment: "confirmed",
        }
      );
      console.log("✅ 트랜잭션 제출 성공:", signature);
      return signature;
    } catch (error) {
      console.error("❌ 트랜잭션 제출 실패, 다른 RPC로 재시도:", error);
      rpcIndex = (rpcIndex + 1) % RPC_ENDPOINTS.length;
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  throw new Error("❌ 모든 RPC에서 트랜잭션 제출 실패");
};

// ✅ 사용자가 트랜잭션을 서명하고 제출하는 함수
export const requestAndSendTransaction = async (wallet, transaction) => {
  if (!wallet || !wallet.signTransaction) {
    throw new Error("❌ 지갑이 연결되지 않았습니다.");
  }

  try {
    // ✅ 사용자가 트랜잭션 서명
    const signedTransaction = await wallet.signTransaction(transaction);

    // ✅ 블록체인에 제출
    return await sendSignedTransaction(signedTransaction);
  } catch (error) {
    console.error("❌ 트랜잭션 처리 중 오류 발생:", error);
    throw new Error("❌ 트랜잭션 처리 실패");
  }
};

