import { useState } from "react";
import axios from "axios";

export default function KrwPaymentForm({ onPaymentSuccess }) {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState(1);
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!email.includes("@")) {
      alert("올바른 이메일 주소를 입력하세요.");
      return;
    }

    setLoading(true);

    try {
      // ✅ 결제 API 요청 (Toss Payments 예제)
      const response = await axios.post("/api/process-payment", { email, amount });
      if (response.data.success) {
        alert(`✅ 결제 성공! ${amount}개의 토큰이 지급됩니다.`);
        onPaymentSuccess();
      } else {
        alert("🚨 결제 실패. 다시 시도하세요.");
      }
    } catch (error) {
      console.error("🚨 결제 오류:", error);
      alert("결제 처리 중 오류가 발생했습니다.");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-lg font-bold mb-4">💳 원화(KRW) 결제</h2>
      <input
        type="email"
        placeholder="이메일 입력"
        className="w-full p-2 border rounded mb-3"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="number"
        placeholder="구매할 토큰 개수"
        className="w-full p-2 border rounded mb-3"
        value={amount}
        onChange={(e) => setAmount(parseInt(e.target.value))}
        min={1}
      />
      <button
        onClick={handlePayment}
        className="w-full bg-blue-500 text-white font-bold py-2 rounded"
        disabled={loading}
      >
        {loading ? "결제 진행 중..." : "💳 결제하기"}
      </button>
    </div>
  );
}

