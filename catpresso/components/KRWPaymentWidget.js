import React, { useEffect, useState } from "react";
// import tossPayments from '@/utils/tossPaymentsClient'; // TossPayments 관련 import 주석 처리

export default function KRWPaymentWidget({ amount }) {
  const [sdkLoaded, setSdkLoaded] = useState(false);

  // TossPayments SDK 로드 (잠시 비활성화하려면 이 부분도 주석 처리하거나, sdkLoaded를 바로 true로 설정)
  useEffect(() => {
    // 아래 코드 전체를 주석 처리하여 TossPayments SDK를 로드하지 않음
    /*
    if (!document.getElementById("tosspayments-sdk")) {
      const script = document.createElement("script");
      script.src = "https://js.tosspayments.com/v2/standard";
      script.id = "tosspayments-sdk";
      script.crossOrigin = "anonymous";
      script.onload = () => setSdkLoaded(true);
      document.body.appendChild(script);
    } else {
      setSdkLoaded(true);
    }
    */
    // 테스트용으로 sdkLoaded를 바로 true로 설정
    setSdkLoaded(true);
  }, []);

  const handlePayment = () => {
    // TossPayments 기능을 임시로 비활성화
    alert("현재 결제 기능은 준비 중입니다.");
    // TossPayments 관련 코드는 아래와 같이 주석 처리합니다.
    /*
    if (!sdkLoaded) {
      console.error("TossPayments SDK is not loaded yet.");
      return;
    }
    const tossPayments = window.TossPayments("test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm");
    const widget = tossPayments.widgets({ customerKey: "ANONYMOUS" });
    widget.setAmount(amount);
    widget.renderPaymentMethods("#payment-methods", amount)
      .then(() => {
        console.log("결제 위젯이 렌더링되었습니다.");
      })
      .catch((err) => {
        console.error("결제 위젯 렌더링 오류:", err);
      });
    */
  };

  return (
    <div>
      <button
        onClick={handlePayment}
        className="w-full bg-white text-black font-bold py-3 rounded-lg"
      >
        원화 결제하기
      </button>
      {/* TossPayments 결제 위젯 UI 컨테이너 */}
      <div id="payment-methods"></div>
    </div>
  );
}

