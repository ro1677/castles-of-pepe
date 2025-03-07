import { useState } from "react";
import WalletConnectStatus from "./WalletConnectStatus";

export default function Navbar({ setActiveSection, toggleLanguage, language }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center bg-black text-white p-4">
      <h1 className="text-xl font-bold">Catpresso</h1>
      <div className="hidden md:flex space-x-6 items-center">
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
        {/* WalletConnectStatus 컴포넌트 삽입 */}
        <WalletConnectStatus />
        <button className="bg-gray-700 px-4 py-2 rounded" onClick={toggleLanguage}>
          🌍 {language === "ko" ? "English" : "한국어"}
        </button>
      </div>
      <button className="md:hidden text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-black text-white flex flex-col items-center space-y-4 py-4 shadow-lg md:hidden">
          <button className="hover:text-yellow-300" onClick={() => { setActiveSection("home"); setMenuOpen(false); }}>
            {language === "ko" ? "홈" : "Home"}
          </button>
          <button className="hover:text-yellow-300" onClick={() => { setActiveSection("about"); setMenuOpen(false); }}>
            {language === "ko" ? "소개" : "About"}
          </button>
          <button className="hover:text-yellow-300" onClick={() => { setActiveSection("techmap"); setMenuOpen(false); }}>
            {language === "ko" ? "테크맵" : "Tech Map"}
          </button>
          <button className="hover:text-yellow-300" onClick={() => { setActiveSection("tokenomics"); setMenuOpen(false); }}>
            {language === "ko" ? "토크노믹스" : "Tokenomics"}
          </button>
          <button className="hover:text-yellow-300" onClick={() => { setActiveSection("guide"); setMenuOpen(false); }}>
            {language === "ko" ? "구매가이드" : "Buy Guide"}
          </button>
          <button className="hover:text-yellow-300" onClick={() => { setActiveSection("staking"); setMenuOpen(false); }}>
            {language === "ko" ? "스테이킹" : "Staking"}
          </button>
          <WalletConnectStatus />
          <button className="bg-gray-700 px-4 py-2 rounded" onClick={() => { toggleLanguage(); setMenuOpen(false); }}>
            🌍 {language === "ko" ? "English" : "한국어"}
          </button>
        </div>
      )}
    </nav>
  );
}

