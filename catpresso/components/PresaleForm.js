import { useState, useEffect } from "react";
import { getSolPrice } from "../utils/getSolPrice";
import { purchasePresaleToken, getWalletBalance } from "../utils/solanaTransaction";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

export default function PresaleForm({ selectedLanguage }) {
    const [amount, setAmount] = useState(1);
    const [solPrice, setSolPrice] = useState(null);
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [remainingTime, setRemainingTime] = useState("");
    const [salesData, setSalesData] = useState({ current: 0, goal: 1000000000 });

    const { publicKey, connected, connect, select, signTransaction } = useWallet();
    const { setVisible } = useWalletModal();

    // ✅ SOL 시세 가져오기
    useEffect(() => {
        async function fetchSolPrice() {
            const price = await getSolPrice();
            setSolPrice(price);
        }
        fetchSolPrice();
    }, []);

    // ✅ 지갑 잔액 가져오기
    useEffect(() => {
        async function fetchBalance() {
            if (publicKey) {
                const balance = await getWalletBalance(publicKey);
                setBalance(balance);
            }
        }
        fetchBalance();
    }, [publicKey]);

    // ✅ 프리세일 종료시간 고정 (30일)
    useEffect(() => {
        setRemainingTime("30일 00시간 00분 00초");
    }, []);

    const SOL_PRICE_KRW = solPrice || 150000;
    const TOKEN_PRICE_KRW = 5;
    const TOKEN_PRICE_SOL = TOKEN_PRICE_KRW / SOL_PRICE_KRW;
    const totalCostSOL = (amount * TOKEN_PRICE_SOL).toFixed(6);
    const totalCostKRW = amount * TOKEN_PRICE_KRW;

    // ✅ 지갑 결제 함수
    const handlePurchase = async () => {
        if (!connected) {
            await connect();
        }
        if (!publicKey) {
            alert(selectedLanguage === "ko" ? "❌ 지갑이 연결되지 않았습니다." : "❌ Wallet is not connected.");
            return;
        }
        if (amount <= 0) {
            alert(selectedLanguage === "ko" ? "❌ 구매할 토큰 수량을 올바르게 입력하세요." : "❌ Please enter a valid token amount.");
            return;
        }

        if (balance < totalCostSOL) {
            alert(
                selectedLanguage === "ko"
                    ? `❌ 잔액이 부족합니다. (필요: ${totalCostSOL} SOL)`
                    : `❌ Insufficient balance. (Required: ${totalCostSOL} SOL)`
            );
            return;
        }

        setLoading(true);
        const txHash = await purchasePresaleToken({ publicKey, signTransaction }, amount, TOKEN_PRICE_SOL);
        alert(
            selectedLanguage === "ko"
                ? `✅ 프리세일 구매 완료! 트랜잭션 해시: ${txHash}`
                : `✅ Presale purchase completed! Transaction hash: ${txHash}`
        );
        setLoading(false);
    };

    // ✅ 원화 결제 함수
    const handleKRWPayment = async () => {
        try {
            if (!email) {
                alert(selectedLanguage === "ko" ? "❌ 이메일을 입력해주세요." : "❌ Please enter your email.");
                return;
            }

            const paymentResponse = await fetch("/api/processPayment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, amount: totalCostKRW }),
            });

            if (!paymentResponse.ok) {
                throw new Error(`❌ 서버 응답 오류: ${paymentResponse.status}`);
            }

            const paymentData = await paymentResponse.json();
            console.log("✅ 원화 결제 응답:", paymentData);

            if (!paymentData.success) {
                alert(selectedLanguage === "ko" ? "❌ 결제 실패: " + paymentData.message : "❌ Payment failed: " + paymentData.message);
                return;
            }

            alert(
                selectedLanguage === "ko"
                    ? `✅ 원화 결제 완료: ${totalCostKRW} KRW\n구매한 토큰이 ${email} 로 전송됩니다.`
                    : `✅ Payment completed: ${totalCostKRW} KRW\nYour purchased tokens will be sent to ${email}.`
            );
        } catch (error) {
            console.error("🚨 원화 결제 실패:", error);
            alert(
                selectedLanguage === "ko"
                    ? `❌ 원화 결제 중 오류 발생: ${error.message}`
                    : `❌ Payment error: ${error.message}`
            );
        }
    };

    return (
        <div className="p-8 bg-black text-white shadow-lg rounded-lg max-w-lg mx-auto w-full">
            <h2 className="text-2xl font-bold mb-4 text-center">
                {selectedLanguage === "ko" ? "☕ 캣프레소 프리세일" : "☕ Catpresso Presale"}
            </h2>

            {/* ✅ 프리세일 남은 시간 및 판매량 */}
            <div className="bg-gray-800 p-3 rounded-lg mb-4 text-center">
                <p className="text-yellow-300">📅 {selectedLanguage === "ko" ? "프리세일 남은 시간" : "Presale Remaining Time"}: {remainingTime}</p>
                <p className="text-yellow-300">
                    {selectedLanguage === "ko" ? "🎯 목표 판매토큰" : "🎯 Target Sale"}: {salesData.current.toLocaleString()} / {salesData.goal.toLocaleString()} 토큰
                </p>
            </div>

            <p className="text-center text-gray-300 mb-4">
                {selectedLanguage === "ko" ? "현재 SOL 시세" : "Current SOL Price"}: {solPrice ? `${solPrice.toLocaleString()} KRW` : "불러오는 중..."}
            </p>
            <p className="text-center text-gray-300 mb-4">💰 {selectedLanguage === "ko" ? "내 잔액" : "My Balance"}: {balance.toFixed(3)} SOL</p>

            <input type="number" placeholder={selectedLanguage === "ko" ? "구매할 토큰 개수" : "Enter token amount"} className="w-full p-2 border rounded mb-3 text-black" value={amount} onChange={(e) => setAmount(parseInt(e.target.value) || 1)} min={1} />

            <input type="email" placeholder={selectedLanguage === "ko" ? "이메일 입력 (원화 결제용)" : "Enter email (KRW payment)"} className="w-full p-2 border rounded mb-3 text-black" value={email} onChange={(e) => setEmail(e.target.value)} />

            <button onClick={handleKRWPayment} className="w-full bg-green-500 text-white font-bold py-3 mt-4 rounded-lg">
                {selectedLanguage === "ko" ? "💳 원화(KRW)로 결제하기" : "💳 Pay in KRW"}
            </button>

            {connected && (
                <>
                    <p className="text-center text-gray-300 mt-4">1 {selectedLanguage === "ko" ? "토큰 가격" : "Token Price"}: {TOKEN_PRICE_SOL.toFixed(6)} SOL / {TOKEN_PRICE_KRW} KRW</p>
                    <p className="text-center text-gray-300">{selectedLanguage === "ko" ? "총 결제 금액" : "Total Cost"}: {totalCostSOL} SOL / {totalCostKRW} KRW</p>

                    <button onClick={handlePurchase} className={`w-full text-black font-bold py-3 rounded-lg ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-white hover:bg-gray-200"}`} disabled={loading}>
                        {loading ? "⏳ 결제 진행 중..." : `🚀 SOL로 결제하기 (${TOKEN_PRICE_SOL.toFixed(6)} SOL/토큰)`}
                    </button>
                </>
            )}
        </div>
    );
}

