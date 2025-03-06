import * as anchor from "@coral-xyz/anchor";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  // 환경변수에서 provider를 자동으로 로드합니다.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  // Anchor Workspace를 사용하여 프로그램 객체를 불러옵니다.
  // 여기서 프로그램 이름은 Cargo.toml의 [package] name 값(보통 소문자)을 CamelCase로 변환한 이름입니다.
  // 예를 들어, package 이름이 "catpresso_presale"라면 Workspace 변수는 "CatpressoPresale"가 됩니다.
  const program = anchor.workspace.CatpressoPresale;

  // PDA 계산 (Rust 코드에서 사용한 seed와 일치해야 합니다.)
  const [presaleAccount, bump] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from("presale")],
    program.programId
  );
  console.log("Presale PDA:", presaleAccount.toBase58());

  // initialize_presale 인스트럭션 호출 (가격과 총 공급량 설정)
  const tx = await program.methods
    .initializePresale(new anchor.BN(0.1 * 10 ** 9), new anchor.BN(1000000))
    .accounts({
      presale_account: presaleAccount, // Rust 코드에서 snake_case로 정의한 계정 이름
      admin: provider.wallet.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .rpc();
  console.log("Transaction signature:", tx);
}

main().catch(console.error);

