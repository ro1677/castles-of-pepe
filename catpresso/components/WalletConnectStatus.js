import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useState } from "react";

export default function WalletConnectStatus() {
  const { publicKey, connected, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [loading, setLoading] = useState(false);

const connectMobileWallet = () => {
  const appUrl = encodeURIComponent('https://www.catpresso.com');
  const redirectLink = encodeURIComponent('https://www.catpresso.com/wallet');
  const phantomDeepLink = `https://phantom.app/ul/v1/connect?app_url=${appUrl}&redirect_link=${redirectLink}`;

  const a = document.createElement('a');
  a.href = phantomDeepLink;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

  const handleConnect = () => {
    setLoading(true);
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile) {
      connectMobileWallet();
    } else {
      setVisible(true);
    }
    setLoading(false);
  };

  return (
    <div>
      {!connected ? (
        <button
          onClick={handleConnect}
          className={`bg-blue-500 px-3 py-1 rounded text-xs ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={loading}
        >
          {loading ? "연결 중..." : "지갑 연결하기"}
        </button>
      ) : (
        <button
          onClick={disconnect}
          className="bg-green-500 px-3 py-1 rounded text-xs"
        >
          연결 해제 ({publicKey?.toString().slice(0, 4)}...)
        </button>
      )}
    </div>
  );
}

