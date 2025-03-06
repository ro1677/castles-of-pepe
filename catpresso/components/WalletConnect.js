import { useEffect, useState } from "react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";

export default function WalletConnect() {
  const { setVisible } = useWalletModal();
  const { publicKey, connected, connect } = useWallet();
  const [walletAddress, setWalletAddress] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (window.solana) {
      const provider = window.solana;
      if (provider.isPhantom) {
        provider.connect({ onlyIfTrusted: true })
          .then((res) => setWalletAddress(res.publicKey.toString()))
          .catch(() => console.warn("자동 로그인 실패"));
      }
    }
  }, []);

  const connectWallet = async () => {
    try {
      setErrorMessage(null);
      if (!window.solana) {
        throw new Error("❌ Phantom 지갑이 설치되어 있지 않습니다.");
      }

      if (!connected) {
        setVisible(true);
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

