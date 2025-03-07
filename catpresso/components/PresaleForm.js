import { useState, useEffect } from "react";
import { getSolPrice } from "../utils/getSolPrice";
import { purchasePresaleToken, getWalletBalance } from "../utils/solanaTransaction";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

// 고정된 프리세일 종료 시간 (예시: 2025년 4월 10일 23:59:59 UTC)
// 실제 종료 시간에 맞게 수정하세요.
const PRESALE_END_TIME = new Date("2025-04-10T23:59:59Z");

export default function PresaleForm({ selectedLanguage }) {
  const [amount, setAmount] = useState("");
  const [solPrice, setSolPrice] = useState(null);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  // timeParts 상태: { days, hours, minutes, seconds }
  const [timeParts, setTimeParts] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [salesData, setSalesData] = useState({ current: 0, goal: 1000000000 });

  const { publicKey, connected, connect, signTransaction } = useWallet();
  const { setVisible } = useWalletModal();

  const numericAmount = parseInt(amount) || 0;

  // TossPayments SDK 로드 상태 (원화 결제용)
  const [sdkLoaded, setSdkLoaded] = useState(false);
  useEffect(() => {
    if (!document.getElementById("tosspayments-sdk")) {
      const script = document.createElement("script");
      script.src = "https://js.tosspayments.com/v2/standard";
      script.id = "tosspayments-sdk";
      script.crossOrigin = "anonymous"; // crossOrigin 속성 추가
      script.onload = () => setSdkLoaded(true);
      document.body.appendChild(script);
    } else {
      setSdkLoaded(true);
    }
  }, []);

  useEffect(() => {
    async function fetchSolPrice() {
      try {
        const price = await getSolPrice();
        setSolPrice(price);
      } catch (error) {
        console.error("Error fetching SOL price:", error);
        setSolPrice(150000);
      }
    }
    fetchSolPrice();
  }, []);

  useEffect(() => {
    async function fetchBalance() {
      if (publicKey) {
        try {
          const walletBalance = await getWalletBalance(publicKey);
          setBalance(walletBalance);
        } catch (error) {
          console.error("Error fetching wallet balance:", error);
          setBalance(0);
        }
      }
    }
    fetchBalance();
  }, [publicKey]);

  // 프리세일 남은 시간 업데이트 (고정 종료 시간 기준)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = PRESALE_END_TIME - now;
      if (diff > 0) {
        const days = Math.floor(diff / (24 * 60 * 60 * 1000));
        const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
        const seconds = Math.floor((diff % (60 * 1000)) / 1000);
        setTimeParts({ days, hours, minutes, seconds });
      } else {
        setTimeParts({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedLanguage]);

  const SOL_PRICE_KRW = solPrice || 150000;
  const TOKEN_PRICE_KRW = 5;
  const TOKEN_PRICE_SOL = TOKEN_PRICE_KRW / SOL_PRICE_KRW;
  const totalCostSOL = (numericAmount * TOKEN_PRICE_SOL).toFixed(6);
  const totalCostKRW = numericAmount * TOKEN_PRICE_KRW;

  // SOL 결제 함수 (SOL로 결제)
  const handlePurchase = async () => {
    if (!connected) {
      setVisible(true);
      return;
    }
    if (!publicKey) {
      alert(selectedLanguage === "ko" ? "❌ 지갑이 연결되지 않았습니다." : "❌ Wallet is not connected.");
      return;
    }
    if (numericAmount <= 0) {
      alert(selectedLanguage === "ko" ? "❌ 구매할 토큰 수량을 올바르게 입력하세요." : "❌ Please enter a valid token amount.");
      return;
    }
    if (balance < parseFloat(totalCostSOL)) {
      alert(
        selectedLanguage === "ko"
          ? `❌ 잔액이 부족합니다. (필요: ${totalCostSOL} SOL)`
          : `❌ Insufficient balance. (Required: ${totalCostSOL} SOL)`
      );
      return;
    }
    setLoading(true);
    try {
      const txHash = await purchasePresaleToken({ publicKey, signTransaction }, numericAmount, TOKEN_PRICE_SOL);
      alert(
        selectedLanguage === "ko"
          ? `✅ 프리세일 구매 완료! 트랜잭션 해시: ${txHash}`
          : `✅ Presale purchase completed! Transaction hash: ${txHash}`
      );
    } catch (error) {
      console.error("Error during SOL purchase:", error);
      alert(
        selectedLanguage === "ko"
          ? `❌ 구매 중 오류 발생: ${error.message}`
          : `❌ Purchase error: ${error.message}`
      );
    }
    setLoading(false);
  };

  // 원화 결제 함수 (TossPayments 위젯 연동)
  const handleKRWPayment = () => {
    if (!email.includes("@")) {
      alert(selectedLanguage === "ko" ? "올바른 이메일 주소를 입력하세요." : "Please enter a valid email address.");
      return;
    }
    if (!sdkLoaded) {
      console.error("TossPayments SDK is not loaded yet.");
      return;
    }
    const tossPayments = window.TossPayments("test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm");
    // 최신 API에 따라 widgets() 메서드를 사용
    const widget = tossPayments.widgets({ customerKey: "ANONYMOUS" });
    widget.setAmount({ currency: "KRW", value: totalCostKRW });
    widget.renderPaymentMethods({ selector: "#payment-methods", variantKey: "DEFAULT" })
      .then(() => {
        console.log("결제 위젯이 렌더링되었습니다.");
      })
      .catch((err) => {
        console.error("결제 위젯 렌더링 오류:", err);
      });
  };

  return (
    <div className="p-8 bg-black text-white shadow-lg rounded-lg max-w-lg mx-auto w-full">
      <h2 className="text-2xl font-bold mb-2 text-center">
        {selectedLanguage === "ko" ? "☕ 캣프레소 프리세일" : "☕ Catpresso Presale"}
      </h2>

      {/* 헤딩과 남은 시간 박스 사이에 작은 설명 텍스트 */}
      <p className="text-center text-xs text-gray-400 mb-2">[종료까지 남은시간]</p>

      {/* 프리세일 남은 시간 박스 */}
    <div className="bg-gray-800 p-2 rounded-lg mb-4 text-center">
      {/* 첫 번째 행: 라벨 (글자 크기를 text-xl로, 간격을 space-x-16, 오프셋 적용) */}
  <div className="flex justify-center space-x-16 text-xl text-yellow-300">
          <span>일</span>
          <span>시</span>
          <span>분</span>
          <span>초</span>
  </div>
     {/* 두 번째 행: 숫자 (글자 크기를 text-xl로, 간격을 space-x-16) */}
  <div className="flex justify-center space-x-14 text-xl font-bold tracking-wider text-yellow-300 mt-1">
    <span>{String(timeParts.days).padStart(2, "0")}</span>
    <span>{String(timeParts.hours).padStart(2, "0")}</span>
    <span>{String(timeParts.minutes).padStart(2, "0")}</span>
    <span>{String(timeParts.seconds).padStart(2, "0")}</span>
  </div>
</div>

      {/* 목표 판매토큰 정보 */}
      <p className="text-center text-white mb-4">
        {selectedLanguage === "ko" ? "🎯 목표 판매토큰" : "🎯 Target Sale"}: {salesData.current.toLocaleString()} / {salesData.goal.toLocaleString()} {selectedLanguage === "ko" ? "(CATP)" : "(CATP)"}
      </p>

      {/* 숨김 처리: 현재 SOL 시세 및 내 잔액 */}
      <div className="hidden">
        <p className="text-center text-gray-300 mb-4">
          {selectedLanguage === "ko" ? "현재 SOL 시세" : "Current SOL Price"}:{" "}
          {solPrice ? `${solPrice.toLocaleString()} KRW` : (selectedLanguage === "ko" ? "불러오는 중..." : "Loading...")}
        </p>
        <p className="text-center text-gray-300 mb-4">
          💰 {selectedLanguage === "ko" ? "내 잔액" : "My Balance"}: {balance.toFixed(3)} SOL
        </p>
      </div>

      <input
        type="number"
        placeholder={selectedLanguage === "ko" ? "구매하실 수량을 입력하세요." : "Enter token quantity"}
        className="w-full p-2 border rounded mb-3 text-black"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        min={1}
      />

      <input
        type="email"
        placeholder={selectedLanguage === "ko" ? "이메일 입력 (원화 결제용)" : "Enter email (KRW payment)"}
        className="w-full p-2 border rounded mb-3 text-black"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* 총 결제 금액 정보 */}
      <p className="text-center text-gray-300 mt-4">
        1 {selectedLanguage === "ko" ? "토큰 가격" : "Token Price"}: {TOKEN_PRICE_SOL.toFixed(6)} SOL / {TOKEN_PRICE_KRW} KRW
      </p>
      <p className="text-center text-gray-300">
        {selectedLanguage === "ko" ? "총 결제 금액" : "Total Cost"}: {totalCostSOL} SOL / {totalCostKRW} KRW
      </p>

      {/* 두 개의 결제 버튼을 가로로 배치 */}
      <div className="flex space-x-4 mt-4">
        <button
          onClick={handleKRWPayment}
          className="flex-1 bg-green-500 text-white font-bold py-3 rounded-lg"
        >
          {selectedLanguage === "ko" ? "💳 원화로 결제" : "💳 Pay in KRW"}
        </button>
        <button
          onClick={handlePurchase}
          className={`flex-1 text-black font-bold py-3 rounded-lg ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-white hover:bg-gray-200"}`}
          disabled={loading}
        >
          {loading
            ? (selectedLanguage === "ko" ? "⏳ 결제 진행 중..." : "⏳ Payment in progress...")
            : (selectedLanguage === "ko"
                ? "🚀 솔라나로 결제"
                : "🚀 Pay with SOLANA")}
        </button>
      </div>

      {/* TossPayments 결제 위젯 UI 컨테이너 */}
      <div id="payment-methods"></div>
    </div>
  );
}

