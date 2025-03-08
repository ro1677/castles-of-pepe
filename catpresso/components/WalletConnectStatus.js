// WalletConnectStatus.js
import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { isWalletConnected } from "@/utils/walletUtils"; // 경로를 실제 프로젝트에 맞게 조정

export default function WalletConnectStatus() {
  const { publicKey, connected, connect, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [showDisconnect, setShowDisconnect] = useState(false);

  useEffect(() => {
    if (!connected) {
      setShowDisconnect(false);
    }
  }, [connected]);

  const handleConnect = async () => {
    console.log("연결 상태:", connected, "publicKey:", publicKey);
    // 연결 전에 지갑이 선택되었는지 확인 (isWalletConnected 함수 활용)
    if (!isWalletConnected({ connected, publicKey })) {
      alert("지갑을 선택해주세요."); // 사용자 안내 메시지
      return;
    }
    try {
      // 연결되지 않은 경우에만 모달을 띄우고 연결 시도
      if (!connected) {
        setVisible(true);
        await connect();
      }
    } catch (error) {
      if (error.name === "WalletNotSelectedError") {
        alert("지갑이 선택되지 않았습니다. 지갑을 선택해주세요.");
      } else if (error.message.includes("User rejected the request")) {
        alert("지갑 연결이 취소되었습니다.");
      } else {
        alert(`지갑 연결 중 오류 발생: ${error.message}`);
      }
      console.error("지갑 연결 실패:", error);
    }
  };

  const handleToggleDisconnect = () => {
    setShowDisconnect((prev) => !prev);
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      setShowDisconnect(false);
    } catch (error) {
      alert(`지갑 연결 해제 중 오류 발생: ${error.message}`);
      console.error("지갑 연결 해제 오류:", error);
    }
  };

  if (!connected) {
    return (
      <button
        onClick={handleConnect}
        className="bg-blue-500 px-3 py-1 rounded text-xs"
      >
        Phantom 지갑 연결하기
      </button>
    );
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={handleToggleDisconnect}
        className="bg-green-500 px-3 py-1 rounded text-xs"
      >
        지갑 연결됨
      </button>
      {showDisconnect && (
        <button
          onClick={handleDisconnect}
          className="absolute left-0 mt-1 bg-red-500 px-3 py-1 rounded text-xs"
        >
          지갑 연결 해제하기
        </button>
      )}
    </div>
  );
}

