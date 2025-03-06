import { useState, useEffect } from "react";
import { getSolPrice } from "../utils/getSolPrice";
import { purchasePresaleToken, getWalletBalance } from "../utils/solanaTransaction";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

export default function PresaleForm({ selectedLanguage }) {
  // 수량 초기값은 빈 문자열로 설정하여 placeholder가 보이도록 함
  const [amount, setAmount] = useState("");
  const [solPrice, setSolPrice] = useState(null);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [remainingTime, setRemainingTime] = useState("");
  const [salesData, setSalesData] = useState({ current: 0, goal: 1000000000 });

  const { publicKey, connected, connect, signTransaction } = useWallet();
  const { setVisible } = useWalletModal();

  // 입력값을 정수로 파싱 (빈 문자열이면 0으로 처리)
  const numericAmount = parseInt(amount) || 0;

  // TossPayments SDK가 로드되었는지 상태 관리 (원화 결제용)
  const [sdkLoaded, setSdkLoaded] = useState(false);

  // ✅ TossPayments SDK 로드 (이미 로드되어 있지 않으면)
  useEffect(() => {
    if (!document.getElementById("tosspayments-sdk")) {
      const script = document.createElement("script");
      script.src = "https://js.tosspayments.com/v2/standard";
      script.id = "tosspayments-sdk";
      script.onload = () => setSdkLoaded(true);
      document.body.appendChild(script);
    } else {
      setSdkLoaded(true);
    }
  }, []);

  // ✅ SOL 시세 가져오기 (네트워크 오류 시 기본값 150,000 KRW 사용)
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

  // ✅ 지갑 잔액 가져오기 (오류 발생 시 0 SOL로 설정)
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

  // ✅ 프리세일 시간 실시간 갱신 (30일 countdown)
  useEffect(() => {
    const endTime = new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000);
    const interval = setInterval(() => {
      const now = new Date();
      const diff = endTime - now;
      if (diff > 0) {
        const days = Math.floor(diff / (24 * 60 * 60 * 1000));
        const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
        const seconds = Math.floor((diff % (60 * 1000)) / 1000);
        setRemainingTime(`${days}일 ${hours}시간 ${minutes}분 ${seconds}초`);
      } else {
        setRemainingTime(selectedLanguage === "ko" ? "0일 0시간 0분 0초" : "0d 0h 0m 0s");
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

  // ✅ 지갑 결제 함수 (SOL로 결제)
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

  // ✅ 원화 결제 함수 (TossPayments 위젯 연동)
  const handleKRWPaymentWidget = () => {
    if (!sdkLoaded) {
      console.error("TossPayments SDK is not loaded yet.");
      return;
    }
    // 테스트용 키로 TossPayments 객체 초기화
    const tossPayments = window.TossPayments("test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm");
    // 결제 위젯 인스턴스 생성 (비회원의 경우 "ANONYMOUS" 사용)
    const widget = tossPayments.widgets({ customerKey: "ANONYMOUS" });
    // 결제 금액 설정 (KRW 단위 결제 금액: totalCostKRW)
    widget.setAmount(totalCostKRW);
    // 결제 UI 렌더링: 지정한 DOM 요소에 위젯 UI를 표시
    widget.renderPaymentMethods("#payment-methods", totalCostKRW)
      .then(() => {
        console.log("결제 위젯이 렌더링되었습니다.");
      })
      .catch((err) => {
        console.error("결제 위젯 렌더링 오류:", err);
      });
  };

  return (
    <div className="p-8 bg-black text-white shadow-lg rounded-lg max-w-lg mx-auto w-full">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {selectedLanguage === "ko" ? "☕ 캣프레소 프리세일" : "☕ Catpresso Presale"}
      </h2>

      {/* 작은 박스: 프리세일 남은 시간만 (글자 크기를 키움) */}
      <div className="bg-gray-800 p-3 rounded-lg mb-4 text-center">
        <p className="text-xl text-yellow-300">
          📅 {selectedLanguage === "ko" ? "프리세일 남은 시간" : "Presale Remaining Time"}: {remainingTime}
        </p>
      </div>

      {/* 목표 판매토큰 정보: 흰색 텍스트, "토큰" 대신 "(CATP)" */}
      <p className="text-center text-white mb-4">
        {selectedLanguage === "ko" ? "🎯 목표 판매토큰" : "🎯 Target Sale"}: {salesData.current.toLocaleString()} / {salesData.goal.toLocaleString()} {selectedLanguage === "ko" ? "(CATP)" : "(CATP)"}
      </p>

      <p className="text-center text-gray-300 mb-4">
        {selectedLanguage === "ko" ? "현재 SOL 시세" : "Current SOL Price"}:{" "}
        {solPrice ? `${solPrice.toLocaleString()} KRW` : (selectedLanguage === "ko" ? "불러오는 중..." : "Loading...")}
      </p>
      <p className="text-center text-gray-300 mb-4">
        💰 {selectedLanguage === "ko" ? "내 잔액" : "My Balance"}: {balance.toFixed(3)} SOL
      </p>

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

      {/* 원화 결제 버튼: TossPayments 결제 위젯 호출 */}
      <button
        onClick={handleKRWPaymentWidget}
        className="w-full bg-green-500 text-white font-bold py-3 mt-4 rounded-lg"
      >
        {selectedLanguage === "ko" ? "💳 원화(KRW)로 결제하기" : "💳 Pay in KRW"}
      </button>

      {/* 항상 노출: 가격 정보 및 SOL 결제 버튼 */}
      <p className="text-center text-gray-300 mt-4">
        1 {selectedLanguage === "ko" ? "토큰 가격" : "Token Price"}: {TOKEN_PRICE_SOL.toFixed(6)} SOL / {TOKEN_PRICE_KRW} KRW
      </p>
      <p className="text-center text-gray-300">
        {selectedLanguage === "ko" ? "총 결제 금액" : "Total Cost"}: {totalCostSOL} SOL / {totalCostKRW} KRW
      </p>
      <button
        onClick={handlePurchase}
        className={`w-full text-black font-bold py-3 mt-4 rounded-lg ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-white hover:bg-gray-200"}`}
        disabled={loading}
      >
        {loading
          ? (selectedLanguage === "ko" ? "⏳ 결제 진행 중..." : "⏳ Payment in progress...")
          : (selectedLanguage === "ko"
              ? `🚀 SOL로 결제하기 (${TOKEN_PRICE_SOL.toFixed(6)} SOL/토큰)`
              : `🚀 Pay with SOL (${TOKEN_PRICE_SOL.toFixed(6)} SOL/token)`)}
      </button>

      {/* TossPayments 결제 위젯 UI가 렌더링될 컨테이너 */}
      <div id="payment-methods"></div>
    </div>
  );
}

