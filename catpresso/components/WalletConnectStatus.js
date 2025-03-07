import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

export default function WalletConnectStatus() {
  const { publicKey, connected, connect, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [showDisconnect, setShowDisconnect] = useState(false);

  // publicKey가 업데이트되면 버튼 상태를 초기화합니다.
  useEffect(() => {
    if (!connected) {
      setShowDisconnect(false);
    }
  }, [connected]);

  const handleConnect = async () => {
    try {
      // 연결되지 않은 경우, 지갑 선택 모달을 띄워 연결 시도
      if (!connected) {
        setVisible(true);
        await connect();
      }
    } catch (error) {
      // WalletNotSelectedError 등 구체적인 에러 처리
      if (error.name === "WalletNotSelectedError") {
        alert("지갑이 선택되지 않았습니다. 지갑을 선택해주세요.");
      } else if (error.message && error.message.includes("User rejected the request")) {
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
    // 지갑 미연결 시: "$CATP 구매" 버튼 표시
    return (
      <button
        onClick={handleConnect}
        className="bg-blue-500 px-3 py-1 rounded text-xs"
      >
        $CATP 구매
      </button>
    );
  }

  // 연결된 상태: "지갑 연결됨" 버튼과 해제 옵션 토글
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

