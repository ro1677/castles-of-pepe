"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import BackgroundInfo from "@/components/BackgroundInfo";
import PresaleForm from "@/components/PresaleForm";
import Image from "next/image";
import WalletConnectStatus from "@/components/WalletConnectStatus";

export default function Home() {
  const [activeSection, setActiveSection] = useState("home");
  const [language, setLanguage] = useState("ko");

  // 언어 전환 함수
  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "ko" ? "en" : "ko"));
  };

  // 각 섹션에 표시할 내용 (예시)
  const sectionContent = {
    home: "",
    about: {
      ko: "캣프레소(CATP)는 멤버십 기반의 디지털 자산 이용권입니다.",
      en: "Catpresso (CATP) is a membership-based digital asset pass.",
    },
    techmap: {
      ko: "캣프레소는 AI & Web3 기반의 스마트 기술을 활용합니다.",
      en: "Catpresso utilizes AI & Web3-based smart technology.",
    },
    tokenomics: {
      ko: "캣프레소의 토큰 경제는 공정성과 투명성을 기반으로 합니다.",
      en: "The tokenomics of Catpresso is based on fairness and transparency.",
    },
    guide: {
      ko: "캣프레소 구매 가이드: Phantom 지갑을 연결하고, Solana로 CATP를 구매하세요.",
      en: "Catpresso Buying Guide: Connect Phantom wallet and buy CATP with Solana.",
    },
    staking: {
      ko: "캣프레소 토큰을 예치하면 추가 보상을 받을 수 있습니다.",
      en: "Stake Catpresso tokens to receive additional rewards.",
    },
  };

  return (
    <div className="bg-backgroundGray min-h-screen pt-16">
      {/* 네비게이션 바 */}
      <Navbar setActiveSection={setActiveSection} toggleLanguage={toggleLanguage} language={language} />

      {/* 배경 정보 영역 */}
      <BackgroundInfo selectedLanguage={language} />

      {/* 섹션별 내용 (home 제외) */}
      <div className="text-center p-4">
        {activeSection !== "home" && (
          <div className="bg-white p-4 rounded-lg shadow-md text-black text-lg max-w-2xl mx-auto">
            {sectionContent[activeSection][language]}
          </div>
        )}
      </div>

      {/* 프리세일 구매 및 지갑 연결 UI */}
      <div className="flex flex-col md:flex-row h-full mt-4 gap-4 md:gap-6">
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-4 md:p-6 h-full">
          {/* 프리세일 구매 폼 컴포넌트 */}
          <PresaleForm selectedLanguage={language} />
          {/* 지갑 연결 및 토큰 지급 관련 컴포넌트 */}  
          <WalletConnectStatus />
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-200 p-4 md:p-6 h-full">
          <Image
            src="/images/catpresso.jpg"
            alt="캣프레소 아트워크"
            width={600}
            height={600}
            unoptimized
            priority
            className="max-w-xs md:max-w-lg w-full h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
}

