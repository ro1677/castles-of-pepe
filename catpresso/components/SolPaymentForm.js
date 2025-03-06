import { useState, useEffect } from "react";
import { getSolPrice } from "../utils/getSolPrice";
import { Connection, PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import BN from "bn.js";

const NETWORK = "https://api.devnet.solana.com";
const TOKEN_PRICE_KRW = 5; // 1토큰 = 5원

export default function SolPaymentForm() {
  const [amount, setAmount] = useState(1);
  const [solPrice, setSolPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const { publicKey, connected, signTransaction } = useWallet();

  useEffect(() => {
    async function fetchSolPrice() {
      const price = await getSolPrice();
      setSolPrice(price);
    }
    fetchSolPrice();
  }, []);

  const handlePurchase = async () => {
    if (!connected || !publicKey) {
      alert("지갑을 연결하세요.");
      return;
    }

    if (!solPrice) {
      alert("SOL 시세를 불러오는 중입니다. 잠시 후 다시 시도하세요.");
      return;
    }

    const solAmount = (amount * TOKEN_PRICE_KRW) / solPrice;
    console.log(`🟢 ${amount}개 토큰 구매 요청: ${solAmount.toFixed(6)} SOL 필요`);

    setLoading(true);

    try {
      const connection = new Connection(NETWORK, "confirmed");
      const transaction = new Transaction();

      transaction.add(
        new TransactionInstruction({
          keys: [{ pubkey: publicKey, isSigner: true, isWritable: true }],
          programId: new PublicKey("CYwMj3xxShjTzkuXRm216rxg6Y4mDBGVhjABGRipakBK"),
          data: Buffer.from(new BN(amount).toArray("le", 8)),
        })
      );

      const signedTx = await signTransaction(transaction);
      const rawTransaction = signedTx.serialize();
      const signature = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: false,
        preflightCommitment: "processed",
      });

      console.log("✅ 트랜잭션 성공!", signature);
      alert(`🎉 구매 성공! 트랜잭션: ${signature}`);
    } catch (error) {
      console.error("❌ 구매 실패:", error);
      alert("구매 중 오류 발생.");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-lg font-bold mb-4">🪙 SOL 결제</h2>
      <p>현재 SOL 시세: {solPrice ? `${solPrice.toLocaleString()} KRW` : "불러오는 중..."}</p>
      <input
        type="number"
        placeholder="구매할 토큰 개수"
        className="w-full p-2 border rounded mb-3"
        value={amount}
        onChange={(e) => setAmount(parseInt(e.target.value))}
        min={1}
      />
      <button
        onClick={handlePurchase}
        className="w-full bg-orange-500 text-white font-bold py-2 rounded"
        disabled={loading}
      >
        {loading ? "결제 진행 중..." : "🪙 SOL로 구매하기"}
      </button>
    </div>
  );
}

