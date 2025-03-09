import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

export default function WalletConnectStatus() {
  const { publicKey, connected, connect, disconnect, select, wallets } = useWallet();
  const { setVisible } = useWalletModal();
  const [showDisconnect, setShowDisconnect] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🚀 자동 연결 로직 (최초 실행 시)
  useEffect(() => {
    if (!connected && publicKey) {
      console.log("🔄 자동 연결 시도 중...");
      connect().catch((error) => console.error("❌ 자동 연결 실패:", error));
    }
  }, [publicKey, connected]);

  // ✅ 데스크톱 & 모바일 지갑 연결 처리
  const handleConnect = async () => {
    try {
      console.log("🟢 지갑 선택창 열기");
      setVisible(true);
      setLoading(true);

      setTimeout(async () => {
        if (!connected) {
          console.log("🔄 지갑 연결 실행...");
          await connect();
          console.log("✅ 지갑 연결 성공");
        }
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("❌ 지갑 연결 실패:", error);
      setLoading(false);
    }
  };

  // ✅ 모바일 환경 감지 후 Phantom & Solflare 연결
  const connectMobileWallet = () => {
    if (/Android|iPhone/i.test(navigator.userAgent)) {
      console.log("📱 모바일 환경 감지됨, Phantom & Solflare 연결 시도...");
      window.location.href = "https://phantom.app/ul/v1/connect"; // 기본 Phantom 딥링크
    } else {
      handleConnect(); // 데스크톱에서는 기존 방식 유지
    }
  };

  return (
    <div className="flex flex-col items-center">
      {!connected ? (
        <button
          onClick={connectMobileWallet}
          className="bg-blue-500 px-4 py-2 rounded text-sm text-white hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "연결 중..." : "지갑 연결하기"}
        </button>
      ) : (
        <div className="relative inline-block">
          <button
            onClick={() => setShowDisconnect((prev) => !prev)}
            className="bg-green-500 px-4 py-2 rounded text-sm text-white hover:bg-green-700 transition"
          >
            연결됨 ({publicKey?.toString().slice(0, 4)}...)
          </button>
          {showDisconnect && (
            <button
              onClick={disconnect}
              className="absolute left-0 mt-2 bg-red-500 px-4 py-2 rounded text-sm text-white hover:bg-red-700 transition"
            >
              연결 해제
            </button>
          )}
        </div>
      )}
    </div>
  );
}

