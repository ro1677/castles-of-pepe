import React, { useEffect, useState } from "react";
import tossPayments from '@/utils/tossPaymentsClient';

export default function KRWPaymentWidget({ amount }) {
  const [sdkLoaded, setSdkLoaded] = useState(false);

  // TossPayments SDK 로드 (이미 로드되어 있지 않으면)
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

  const handlePayment = () => {
    if (!sdkLoaded) {
      console.error("TossPayments SDK is not loaded yet.");
      return;
    }
    // 테스트용 키로 TossPayments 객체 초기화
    const tossPayments = window.TossPayments("test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm");
    // 결제 위젯 인스턴스 생성: 비회원의 경우 "ANONYMOUS" 사용
    const widget = tossPayments.widget({ customerKey: "ANONYMOUS" });
    // 결제 금액 설정 (amount는 KRW 단위 숫자)
    widget.setAmount(amount);
    // 결제 UI 렌더링: 지정한 DOM 요소에 결제 위젯 UI를 표시합니다.
    widget.renderPaymentMethods("#payment-methods", amount)
      .then(() => {
        console.log("결제 위젯이 렌더링되었습니다.");
      })
      .catch((err) => {
        console.error("결제 위젯 렌더링 오류:", err);
      });
  };

  return (
    <div>
      <button
        onClick={handlePayment}
        className="w-full bg-white text-black font-bold py-3 rounded-lg"
      >
        원화 결제하기
      </button>
      {/* 결제 위젯 UI가 렌더링될 컨테이너 */}
      <div id="payment-methods"></div>
    </div>
  );
}

