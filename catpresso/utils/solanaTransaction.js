import {
    Connection,
    PublicKey,
    Transaction,
    SystemProgram,
    sendAndConfirmTransaction
} from "@solana/web3.js";
import {
    getAssociatedTokenAddress,
    createAssociatedTokenAccountInstruction,
    createTransferInstruction,
    TOKEN_PROGRAM_ID
} from "@solana/spl-token";

// ✅ Solana 메인넷 연결
const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");

// ✅ 프리세일 결제 계정 (SOL 결제 받는 계정)
const PRESALE_ACCOUNT = new PublicKey("7BWDh2smvixYi5iup7h4oaA5VXtaVi6hmDGkgoooEfHi");

// ✅ 캣프레소 토큰 민트 주소 (SPL 토큰 전송에 필요)
const CATPRESSO_TOKEN_MINT = new PublicKey("GvxpqNTXmVUCH2RxHRpsacwtUMAuxJNuqV7D4S42UbPm");

// ✅ 프리세일 참여자에게 토큰을 지급할 계정 (현재 소유자)
const PRESALE_TOKEN_OWNER = new PublicKey("A7oYVN5JDkS7vdgiT8TsGHNJvPVVQBszr4S46GZ6LDfp");

// ✅ 현재 지갑 SOL 잔액 조회
export const getWalletBalance = async (walletAddress) => {
    try {
        if (!walletAddress) {
            throw new Error("🚨 지갑이 연결되지 않았습니다.");
        }

        const balance = await connection.getBalance(new PublicKey(walletAddress));
        return balance / 10 ** 9; // lamports → SOL 변환
    } catch (error) {
        console.error("❌ SOL 잔액 조회 실패:", error);
        return 0;
    }
};

// ✅ SOL + SPL 토큰 전송 트랜잭션 실행 (🔥 **메인넷에서 사용 가능하도록 수정**)
export const purchasePresaleToken = async (wallet, amount, TOKEN_PRICE_SOL) => {
    try {
        if (!wallet || !wallet.publicKey) {
            throw new Error("❌ 지갑이 연결되지 않았습니다.");
        }

        // ✅ 🚀 SOL 전송 금액 계산 (소수점 오류 방지)
        const totalCost = Math.round(amount * TOKEN_PRICE_SOL * 10 ** 9); // SOL → lamports 변환

        // ✅ 🚀 사용자의 SPL 토큰 계정 가져오기 (없으면 생성 필요)
        const userTokenAccount = await getAssociatedTokenAddress(
            CATPRESSO_TOKEN_MINT,
            wallet.publicKey
        );

        // ✅ 🚀 프리세일 소유자의 SPL 토큰 계정 가져오기
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

        // ✅ 🚀 SPL 토큰 전송 트랜잭션 추가
        transaction.add(
            createTransferInstruction(
                presaleTokenAccount, // 출발 계정 (프리세일 토큰 보유 계정)
                userTokenAccount, // 도착 계정 (구매자 계정)
                PRESALE_TOKEN_OWNER, // 권한자 (프리세일 운영자)
                amount * 10 ** 9, // 전송할 토큰 양 (DECIMALS = 9)
                [],
                TOKEN_PROGRAM_ID
            )
        );

        // ✅ 블록 해시 가져오기
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        transaction.feePayer = wallet.publicKey;

        // ✅ 🚀 지갑에서 트랜잭션 서명 요청
        const signedTransaction = await wallet.signTransaction(transaction);

        // ✅ 🚀 트랜잭션 전송
        const signature = await connection.sendRawTransaction(signedTransaction.serialize(), {
            skipPreflight: false,
            preflightCommitment: "confirmed",
        });

        console.log("✅ 트랜잭션 성공:", signature);
        return signature;
    } catch (error) {
        console.error("❌ 트랜잭션 실패:", error);
        throw error;
    }
};

