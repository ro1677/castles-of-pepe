"use client";  // Next.js 클라이언트 컴포넌트 설정

import Image from "next/image";
import PresaleForm from "@/components/PresaleForm";
import BackgroundInfo from "@/components/BackgroundInfo";
import Navbar from "@/components/Navbar";
import { useState } from "react";

export default function Home() {
  const [activeSection, setActiveSection] = useState("home");
  const [language, setLanguage] = useState("ko");

  // 언어 변경 함수
  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === "ko" ? "en" : "ko"));
  };

  // 각 섹션에 표시할 내용 (한/영 지원)
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
    // 상단 네비게이션 바 높이만큼 여백(pt-16) 부여
    <div className="bg-backgroundGray min-h-screen pt-16">
      {/* 네비게이션 바 */}
      <Navbar setActiveSection={setActiveSection} toggleLanguage={toggleLanguage} language={language} />

      {/* 배경 정보 영역 */}
      <BackgroundInfo selectedLanguage={language} />

      {/* 선택한 섹션의 내용 */}
      <div className="text-center p-4">
        {activeSection !== "home" && (
          <div className="bg-white p-4 rounded-lg shadow-md text-black text-lg max-w-2xl mx-auto">
            {sectionContent[activeSection][language]}
          </div>
        )}
      </div>

      {/* 프리세일 구매 및 이미지 섹션 */}
      <div className="flex flex-col md:flex-row h-full mt-4 gap-4 md:gap-6">
        <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-6 h-full">
          <PresaleForm selectedLanguage={language} />
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-200 p-4 md:p-6 h-full">
          <Image
            src="/images/catpresso.jpg"
            alt="캣프레소 아트워크"
            width={600}
            height={600}
            unoptimized
            priority  // 이 속성을 추가합니다.
            className="max-w-xs md:max-w-lg w-full h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
}

