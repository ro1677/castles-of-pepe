import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

export default function WalletConnectStatus() {
  const { publicKey, connected, connect, disconnect, select } = useWallet();
  const { setVisible } = useWalletModal();
  const [loading, setLoading] = useState(false);
  const [showDisconnect, setShowDisconnect] = useState(false);

  // ✅ Solflare & Phantom 자동 연결 로직 (Solflare는 연결 속도 느려서 대기시간 추가)
  useEffect(() => {
    if (!connected && publicKey) {
      console.log("🔄 자동 연결 시도...");
      setLoading(true);
      setTimeout(() => {
        connect()
          .then(() => console.log("✅ 지갑 자동 연결 성공"))
          .catch((error) => console.error("❌ 자동 연결 실패:", error))
          .finally(() => setLoading(false));
      }, 1500); // ⏳ Solflare 지연 해결
    }
  }, [publicKey, connected]);

  // ✅ 지갑 연결 실행 함수 (선택 → 연결)
  const handleConnect = async () => {
    try {
      console.log("🟢 지갑 선택창 열기");
      setVisible(true); // 모달 열기

      setTimeout(async () => {
        if (!connected && publicKey) {
          console.log("🔄 지갑 연결 실행...");
          setLoading(true);
          await connect();
          console.log("✅ 지갑 연결 성공");
          setLoading(false);
        }
      }, 1000); // ⏳ 1초 대기 후 연결 시도
    } catch (error) {
      console.error("❌ 지갑 연결 실패:", error);
      setLoading(false);
    }
  };

  // ✅ 모바일에서 Phantom & Solflare 연결 (딥링크)
  const connectMobileWallet = () => {
    if (/Android|iPhone/i.test(navigator.userAgent)) {
      console.log("📱 모바일 환경 감지, Phantom & Solflare 연결...");
      window.location.href = "https://phantom.app/ul/v1/connect"; // Phantom 딥링크
    } else {
      handleConnect(); // 데스크톱에서는 기존 방식 유지
    }
  };

  return !connected ? (
    <button
      onClick={connectMobileWallet}
      className={`bg-blue-500 px-3 py-1 rounded text-xs ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      disabled={loading}
    >
      {loading ? "연결중..." : "지갑 연결하기"}
    </button>
  ) : (
    <div>
      <button
        onClick={() => setShowDisconnect((prev) => !prev)}
        className="bg-green-500 px-3 py-1 rounded text-xs"
      >
        연결됨 ({publicKey?.toString().slice(0, 4)}...)
      </button>
      {showDisconnect && (
        <button onClick={disconnect} className="bg-red-500 px-3 py-1 rounded text-xs">
          연결 해제
        </button>
      )}
    </div>
  );
}

