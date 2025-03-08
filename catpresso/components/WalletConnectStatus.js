// WalletConnectStatus.js
import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

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
    try {
      // 만약 아직 연결되지 않았다면 바로 연결 시도를 진행합니다.
      if (!connected) {
        setVisible(true); // 지갑 모달을 띄워 사용자가 지갑을 선택하게 함
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

