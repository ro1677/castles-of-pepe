import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

export default function WalletConnectStatus() {
  const { publicKey, connected, connect, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [showDisconnect, setShowDisconnect] = useState(false);

  useEffect(() => {
    console.log("현재 지갑 상태:", { publicKey, connected });
  }, [publicKey, connected]);

  const handleConnect = async () => {
    try {
      console.log("🔵 지갑 연결 시도...");
      setVisible(true); // 모달 표시

      await connect(); // 연결 시도
      console.log("🟢 지갑 연결 성공:", publicKey?.toString());
    } catch (error) {
      console.error("❌ 지갑 연결 실패:", error);
    }
  };

  const handleDisconnect = async () => {
    try {
      console.log("🔴 지갑 연결 해제 시도...");
      await disconnect();
      setShowDisconnect(false);
      console.log("✅ 지갑 연결 해제 완료");
    } catch (error) {
      console.error("❌ 지갑 해제 오류:", error);
    }
  };

  return !connected ? (
    <button onClick={handleConnect} className="bg-blue-500 px-3 py-1 rounded text-xs">
      지갑 연결하기
    </button>
  ) : (
    <div>
      <button onClick={() => setShowDisconnect((prev) => !prev)} className="bg-green-500 px-3 py-1 rounded text-xs">
        연결됨 ({publicKey?.toString().slice(0, 4)}...)
      </button>
      {showDisconnect && (
        <button onClick={handleDisconnect} className="bg-red-500 px-3 py-1 rounded text-xs">
          연결 해제
        </button>
      )}
    </div>
  );
}

