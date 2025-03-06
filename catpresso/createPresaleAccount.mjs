import {
  Connection,
  PublicKey,
  SystemProgram,
  Keypair,
} from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import BN from "bn.js";
import IDL from "./catpresso-presale/target/idl/catpresso_presale.json" assert { type: "json" };
import dotenv from "dotenv";

dotenv.config();

const { AnchorProvider, Program, Wallet } = anchor;
const PROGRAM_ID = new PublicKey(process.env.PROGRAM_ID);
const PRESALE_SEED = "presale";

const connection = new Connection(process.env.RPC_URL, "confirmed");

let secretKey;
try {
  secretKey = JSON.parse(process.env.PRIVATE_KEY);
  if (!Array.isArray(secretKey)) throw new Error("PRIVATE_KEY가 배열이 아닙니다.");
} catch (e) {
  console.error("❌ PRIVATE_KEY 파싱 실패: .env 파일 확인 필요", e);
  process.exit(1);
}

const keypair = Keypair.fromSecretKey(new Uint8Array(secretKey));
const wallet = new Wallet(keypair);
const provider = new AnchorProvider(connection, wallet, { commitment: "confirmed" });
const program = new Program(IDL, PROGRAM_ID, provider);

async function createPresaleAccount() {
  try {
    // PDA 생성 (Rust 프로그램의 seeds와 일치)
    const [presaleAccount, presaleBump] = await PublicKey.findProgramAddress(
      [Buffer.from(PRESALE_SEED)],
      PROGRAM_ID
    );
    console.log("📌 Presale PDA 주소:", presaleAccount.toBase58());

    const tx = await program.methods
      .initializePresale(new BN(0.1 * 10 ** 9), new BN(1000000))
      .accounts({
        presale_account: presaleAccount, // IDL에서 수정한 이름 "presale_account"
        admin: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([keypair])
      .rpc();

    console.log(`✅ Presale 계정 생성 완료! TX: ${tx}`);
  } catch (error) {
    console.error("❌ Presale 계정 생성 실패:", error);
  }
}

createPresaleAccount();

