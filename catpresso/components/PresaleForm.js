// PresaleForm.js
import { useState, useEffect } from "react";
import { getSolPrice } from "../utils/getSolPrice";
import { purchasePresaleToken, getWalletBalance } from "../utils/solanaTransaction";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

const PRESALE_END_TIME = new Date("2025-04-10T23:59:59Z");

export default function PresaleForm({ selectedLanguage }) {
  const [amount, setAmount] = useState("");
  const [solPrice, setSolPrice] = useState(null);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [timeParts, setTimeParts] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [salesData, setSalesData] = useState({ current: 0, goal: 1000000000 });
  const [solPaid, setSolPaid] = useState(false); // ✅ 결제 여부 저장
  const [txHash, setTxHash] = useState(null);   // ✅ 트랜잭션 해시 저장

  const { publicKey, connected, signTransaction } = useWallet();
  const { setVisible } = useWalletModal();

  const numericAmount = parseInt(amount) || 0;

  // TossPayments SDK 로드 (CORS 문제 해결을 위한 로컬 프록시 사용)
  const [sdkLoaded, setSdkLoaded] = useState(false);
  useEffect(() => {
    if (!document.getElementById("tosspayments-sdk")) {
      const script = document.createElement("script");
      script.src = '/api/toss-payments-sdk?v=1';
      script.id = "tosspayments-sdk";
      script.crossOrigin = "anonymous";
      script.onload = () => {
        console.log("Toss Payments SDK loaded successfully.");
        setSdkLoaded(true);
      };
      script.onerror = (error) => {
        console.error("Failed to load Toss Payments SDK:", error);
        setSdkLoaded(false);
      };
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
      alert("❌ 지갑이 연결되지 않았습니다.");
      return;
    }
    if (numericAmount <= 0) {
      alert("❌ 구매할 토큰 수량을 입력하세요.");
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
      // ✅ 트랜잭션을 최신 블록 해시로 생성하여 사용자가 직접 서명하도록 purchasePresaleToken 호출
      const txHash = await purchasePresaleToken({ publicKey, signTransaction }, numericAmount, TOKEN_PRICE_SOL);
      
      alert(`✅ 프리세일 구매 완료! 트랜잭션 해시: ${txHash}`);
    } catch (error) {
      console.error("결제 오류:", error);
      alert(`❌ 결제 오류 발생: ${error.message}`);
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
    <>
      <div className="relative overflow-hidden p-8 bg-black text-white shadow-lg rounded-lg max-w-lg mx-auto w-full">
        {/* 최상단 애니메이션 텍스트 */}
        <p
          className="absolute top-0 left-0 w-full slide-text text-center text-xs text-gray-400"
          style={{ height: "2rem", lineHeight: "2rem" }}
        >
          * 지갑이 없으신 경우, 수량과 이메일 입력 후, 원화 구매 버튼을 누르십시오. 토큰이 이메일 주소로 발송됩니다.
        </p>

        <div className="pt-10">
          <h2 className="text-2xl font-bold mb-2 text-center">
            {selectedLanguage === "ko" ? "☕ 캣프레소 프리세일" : "☕ Catpresso Presale"}
          </h2>

          <p className="text-center text-xs text-gray-400 mb-2">[종료까지 남은시간]</p>

          <div className="bg-gray-800 p-2 rounded-lg mb-4 text-center">
            <div className="flex justify-center space-x-16 text-xl text-yellow-300">
              <span>일</span>
              <span>시</span>
              <span>분</span>
              <span>초</span>
            </div>
            <div className="flex justify-center space-x-14 text-xl font-bold tracking-wider text-yellow-300 mt-1">
              <span>{String(timeParts.days).padStart(2, "0")}</span>
              <span>{String(timeParts.hours).padStart(2, "0")}</span>
              <span>{String(timeParts.minutes).padStart(2, "0")}</span>
              <span>{String(timeParts.seconds).padStart(2, "0")}</span>
            </div>
          </div>

          <p className="text-center text-white mb-4">
            {selectedLanguage === "ko" ? "🎯 목표 판매토큰" : "🎯 Target Sale"}: {salesData.current.toLocaleString()} / {salesData.goal.toLocaleString()} (CATP)
          </p>

          {/* SOL 시세 및 잔액(숨김 처리) */}
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

          <p className="text-center text-gray-300 mt-4">
            1 {selectedLanguage === "ko" ? "토큰 가격" : "Token Price"}: {TOKEN_PRICE_SOL.toFixed(6)} SOL / {TOKEN_PRICE_KRW} KRW
          </p>
          <p className="text-center text-gray-300">
            {selectedLanguage === "ko" ? "총 결제 금액" : "Total Cost"}: {totalCostSOL} SOL / {totalCostKRW} KRW
          </p>

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

          <div id="payment-methods"></div>

          {/* ✅ SOL 결제 성공 시 토큰 지급 버튼 렌더링 */}
          {solPaid && (
            <div className="mt-4">
              <button
                onClick={() => {
                  // 토큰 지급 처리 로직 추가 (예시)
                  alert(selectedLanguage === "ko" ? "토큰이 지급되었습니다!" : "Tokens have been issued!");
                }}
                className="w-full bg-purple-500 text-white font-bold py-3 rounded-lg"
              >
                {selectedLanguage === "ko" ? "토큰 지급받기" : "Claim Tokens"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CSS 인라인 스타일로 애니메이션 정의 */}
      <style jsx>{`
        @keyframes slideLeft {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .slide-text {
          display: inline-block;
          white-space: nowrap;
          animation: slideLeft 10s linear infinite;
        }
      `}</style>
    </>
  );
}

