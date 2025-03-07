import { useEffect, useState } from "react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";

export default function WalletConnect() {
  const { setVisible } = useWalletModal();
  const { publicKey, connected, connect } = useWallet();
  const [walletAddress, setWalletAddress] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // publicKey가 변경되면 walletAddress를 업데이트
  useEffect(() => {
    if (publicKey) {
      setWalletAddress(publicKey.toString());
    }
  }, [publicKey]);

  const connectWallet = async () => {
    try {
      setErrorMessage(null);
      // 직접 window.solana를 확인하지 않고, wallet adapter의 connect()를 호출합니다.
      if (!connected) {
        setVisible(true); // 지갑 모달 표시
        await connect();
      }
      if (publicKey) {
        setWalletAddress(publicKey.toString());
      }
    } catch (error) {
      if (error.message.includes("User rejected the request")) {
        setErrorMessage("❌ 지갑 연결이 취소되었습니다.");
      } else {
        setErrorMessage(`오류 발생: ${error.message}`);
      }
      console.error("지갑 연결 실패:", error);
    }
  };

  return (
    <div>
      {walletAddress ? (
        <p className="text-coffee font-semibold text-sm">
          연결됨: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
        </p>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-orangeAccent text-white px-4 py-2 rounded-md text-sm hover:bg-orange-600 transition"
        >
          Phantom 지갑 연결
        </button>
      )}
      {errorMessage && <p className="text-red-500 text-xs mt-1">{errorMessage}</p>}
    </div>
  );
}

