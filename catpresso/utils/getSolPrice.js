import axios from "axios";

export async function getSolPrice() {
  try {
    const response = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=krw");
    return response.data.solana.krw; // SOL의 원화 가격 반환
  } catch (error) {
    console.error("🚨 SOL 시세 조회 오류:", error);
    return null;
  }
}

