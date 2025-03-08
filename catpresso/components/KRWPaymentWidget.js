import React, { useEffect, useState } from "react";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";

export default function KRWPaymentWidget({ amount, email, selectedLanguage, totalCostKRW }) {
  const [sdkLoaded, setSdkLoaded] = useState(false);

  // TossPayments SDK를 동적으로 로드하고 에러 핸들링 추가
  useEffect(() => {
    const existingScript = document.getElementById("tosspayments-sdk");
    if (existingScript) {
      setSdkLoaded(true);
    } else {
      const script = document.createElement("script");
      script.src = "https://js.tosspayments.com/v2/standard";
      script.id = "tosspayments-sdk";
      script.crossOrigin = "anonymous";
      script.onload = () => setSdkLoaded(true);
      script.onerror = (error) => {
        console.error("Failed to load Toss Payments SDK:", error);
        setSdkLoaded(false);
      };
      document.body.appendChild(script);
    }
  }, []);

  const handleKRWPayment = async () => {
    if (!email.includes("@")) {
      alert(selectedLanguage === "ko" ? "올바른 이메일 주소를 입력하세요." : "Please enter a valid email address.");
      return;
    }
    try {
      const tossPayments = await loadTossPayments("test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm");
      const widget = tossPayments.widgets({ customerKey: "ANONYMOUS" });
      widget.setAmount({ currency: "KRW", value: totalCostKRW });
      await widget.renderPaymentMethods({ selector: "#payment-methods", variantKey: "DEFAULT" });
      console.log("결제 위젯이 렌더링되었습니다.");
    } catch (err) {
      console.error("결제 위젯 렌더링 오류:", err);
    }
  };

  return (
    <div>
      <button
        onClick={handleKRWPayment}
        className="w-full bg-white text-black font-bold py-3 rounded-lg"
      >
        원화 결제하기
      </button>
      {/* TossPayments 결제 위젯 UI가 렌더링될 컨테이너 */}
      <div id="payment-methods"></div>
    </div>
  );
}

