import { Connection, PublicKey, Transaction, SystemProgram, sendAndConfirmTransaction } from "@solana/web3.js";

const SOLANA_NETWORK = "https://api.devnet.solana.com";
const PROGRAM_ID = new PublicKey("YOUR_PROGRAM_ID");
const PRESALE_ACCOUNT = new PublicKey("YOUR_PRESALE_ACCOUNT");

export async function purchaseToken(wallet, amount) {
    const connection = new Connection(SOLANA_NETWORK, "confirmed");
    const transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: wallet.publicKey,
            toPubkey: PRESALE_ACCOUNT,
            lamports: amount * 1e9,  // SOL to lamports 변환
        })
    );

    const signature = await sendAndConfirmTransaction(connection, transaction, [wallet]);
    console.log("✅ 트랜잭션 성공: ", signature);
    return signature;
}

