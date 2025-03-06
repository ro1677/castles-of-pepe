"use client";  // Next.js 클라이언트 컴포넌트 설정

import Image from "next/image";
import WalletConnect from "@/components/WalletConnect";
import PresaleForm from "@/components/PresaleForm";
import { useState } from "react";

// ✅ 네비게이션 바 컴포넌트
function Navbar({ setActiveSection, toggleLanguage, language }) {
  return (
    <nav className="flex justify-between items-center bg-black text-white p-4">
      {/* 왼쪽: 로고 */}
      <h1 className="text-xl font-bold">Catpresso</h1>

      {/* 중간: 데스크탑 네비게이션 (PC에서만 보임) */}
      <div className="hidden md:flex space-x-6">
        <button className="hover:text-yellow-300" onClick={() => setActiveSection("home")}>
          {language === "ko" ? "홈" : "Home"}
        </button>
        <button className="hover:text-yellow-300" onClick={() => setActiveSection("about")}>
          {language === "ko" ? "소개" : "About"}
        </button>
        <button className="hover:text-yellow-300" onClick={() => setActiveSection("techmap")}>
          {language === "ko" ? "테크맵" : "Tech Map"}
        </button>
        <button className="hover:text-yellow-300" onClick={() => setActiveSection("tokenomics")}>
          {language === "ko" ? "토크노믹스" : "Tokenomics"}
        </button>
        <button className="hover:text-yellow-300" onClick={() => setActiveSection("guide")}>
          {language === "ko" ? "구매가이드" : "Buy Guide"}
        </button>
        <button className="hover:text-yellow-300" onClick={() => setActiveSection("staking")}>
          {language === "ko" ? "스테이킹" : "Staking"}
        </button>
        <button className="bg-gray-700 px-4 py-2 rounded" onClick={toggleLanguage}>
          🌍 {language === "ko" ? "English" : "한국어"}
        </button>
      </div>

      {/* 오른쪽: Phantom 지갑 연결 버튼 (PC에서만 보임) */}
      <div className="hidden md:block">
        <WalletConnect />
      </div>
    </nav>
  );
}

// ✅ Home 컴포넌트
export default function Home() {
  const [activeSection, setActiveSection] = useState("home"); // 현재 선택된 섹션
  const [language, setLanguage] = useState("ko"); // 언어 상태 (ko: 한국어, en: 영어)

  // ✅ 언어 변경 함수
  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === "ko" ? "en" : "ko"));
  };

  // ✅ 각 섹션에 표시할 내용 (한/영 지원)
  const sectionContent = {
    home: "",
    about: {
      ko: "캣프레소(CATP)는 멤버십 기반의 디지털 자산 이용권입니다.",
      en: "Catpresso (CATP) is a membership-based digital asset pass."
    },
    techmap: {
      ko: "캣프레소는 AI & Web3 기반의 스마트 기술을 활용합니다.",
      en: "Catpresso utilizes AI & Web3-based smart technology."
    },
    tokenomics: {
      ko: "캣프레소의 토큰 경제는 공정성과 투명성을 기반으로 합니다.",
      en: "The tokenomics of Catpresso is based on fairness and transparency."
    },
    guide: {
      ko: "캣프레소 구매 가이드: Phantom 지갑을 연결하고, Solana로 CATP를 구매하세요.",
      en: "Catpresso Buying Guide: Connect Phantom wallet and buy CATP with Solana."
    },
    staking: {
      ko: "캣프레소 토큰을 예치하면 추가 보상을 받을 수 있습니다.",
      en: "Stake Catpresso tokens to receive additional rewards."
    }
  };

  return (
    <div className="bg-backgroundGray min-h-screen">
      {/* ✅ 네비게이션 바 */}
      <Navbar setActiveSection={setActiveSection} toggleLanguage={toggleLanguage} language={language} />

      {/* ✅ 메인 콘텐츠: 선택한 섹션의 내용 표시 */}
      <div className="text-center p-6">
        {activeSection !== "home" && (
          <div className="bg-white p-6 rounded-lg shadow-md text-black text-lg max-w-2xl mx-auto">
            {sectionContent[activeSection][language]}
          </div>
        )}
      </div>

      {/* ✅ 메인 콘텐츠: 프리세일 구매 + 이미지 */}
      <div className="flex flex-col md:flex-row h-full mt-10 gap-6 md:gap-12">
        {/* ✅ 왼쪽: 프리세일 구매 UI */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12 h-full">
          <PresaleForm selectedLanguage={language} />
        </div>

        {/* ✅ 오른쪽: 이미지 섹션 */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-200 p-8 md:p-12 h-full">
          <Image
            src="/images/catpresso.jpg"
            alt="캣프레소 아트워크"
            width={600}
            height={600}
            unoptimized
            className="max-w-xs md:max-w-lg w-full h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
}

