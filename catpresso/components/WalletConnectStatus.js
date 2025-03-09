import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

export default function WalletConnectStatus() {
  const { publicKey, connected, connect, disconnect, select } = useWallet();
  const { setVisible } = useWalletModal();
  const [showDisconnect, setShowDisconnect] = useState(false);

  // 🚀 지갑 선택 후 자동 연결
  useEffect(() => {
    if (!connected && publicKey) {
      console.log("🔄 자동 연결 시도...");
      connect().catch((error) => console.error("❌ 자동 연결 실패:", error));
    }
  }, [publicKey, connected]);

  const handleConnect = async () => {
    try {
      console.log("🟢 지갑 선택창 열기");
      setVisible(true);

      setTimeout(async () => {
        if (!connected) {
          console.log("🔄 지갑 연결 실행...");
          await connect();
          console.log("✅ 지갑 연결 성공");
        }
      }, 500);
    } catch (error) {
      console.error("❌ 지갑 연결 실패:", error);
    }
  };

  // ✅ 모바일에서 Phantom & Solflare 연결
  const connectMobileWallet = () => {
    if (/Android|iPhone/i.test(navigator.userAgent)) {
      console.log("📱 모바일 환경 감지, Phantom & Solflare 연결...");
      window.location.href = "https://phantom.app/ul/v1/connect"; // 기본 Phantom 딥링크
    } else {
      handleConnect(); // 데스크톱에서는 기존 방식 유지
    }
  };

  return !connected ? (
    <button
      onClick={connectMobileWallet}
      className="bg-blue-500 px-3 py-1 rounded text-xs"
    >
      지갑 연결하기
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

