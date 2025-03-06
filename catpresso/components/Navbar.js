import { useState } from "react";
import WalletConnect from "@/components/WalletConnect";

export default function Navbar({ setActiveSection }) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="flex justify-between items-center bg-black text-white p-4">
            <h1 className="text-xl font-bold">Catpresso</h1>

            {/* 데스크탑 네비게이션 */}
            <div className="hidden md:flex space-x-6">
                <button className="hover:text-yellow-300" onClick={() => setActiveSection("home")}>홈</button>
                <button className="hover:text-yellow-300" onClick={() => setActiveSection("about")}>소개</button>
                <button className="hover:text-yellow-300" onClick={() => setActiveSection("techmap")}>테크맵</button>
                <button className="hover:text-yellow-300" onClick={() => setActiveSection("tokenomics")}>토크노믹스</button>
                <button className="hover:text-yellow-300" onClick={() => setActiveSection("guide")}>구매가이드</button>
                <button className="hover:text-yellow-300" onClick={() => setActiveSection("staking")}>스테이킹</button>
                <button className="bg-gray-700 px-4 py-2 rounded">🌍 언어 변경</button>
            </div>

            {/* 지갑 연결 버튼 */}
            <div className="hidden md:block">
                <WalletConnect />
            </div>

            {/* 모바일 메뉴 버튼 */}
            <button className="md:hidden text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
                ☰
            </button>

            {/* 모바일 메뉴 */}
            {menuOpen && (
                <div className="absolute top-16 left-0 w-full bg-black text-white flex flex-col items-center space-y-4 py-4 shadow-lg md:hidden">
                    <button className="hover:text-yellow-300" onClick={() => setActiveSection("home")}>홈</button>
                    <button className="hover:text-yellow-300" onClick={() => setActiveSection("about")}>소개</button>
                    <button className="hover:text-yellow-300" onClick={() => setActiveSection("techmap")}>테크맵</button>
                    <button className="hover:text-yellow-300" onClick={() => setActiveSection("tokenomics")}>토크노믹스</button>
                    <button className="hover:text-yellow-300" onClick={() => setActiveSection("guide")}>구매가이드</button>
                    <button className="hover:text-yellow-300" onClick={() => setActiveSection("staking")}>스테이킹</button>
                    <button className="bg-gray-700 px-4 py-2 rounded">🌍 언어 변경</button>
                    <WalletConnect />
                </div>
            )}
        </nav>
    );
}

