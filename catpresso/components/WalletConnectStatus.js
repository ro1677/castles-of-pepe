import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useState } from "react";
import nacl from "tweetnacl";
import bs58 from "bs58";

export default function WalletConnectStatus() {
  const { publicKey, connected, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [loading, setLoading] = useState(false);

  // ✅ Phantom 모바일 딥링크 연결 함수
  const connectMobileWallet = () => {
    const dappKeyPair = nacl.box.keyPair(); // 🔹 DApp 공개 키 생성
    const dappPublicKey = bs58.encode(dappKeyPair.publicKey); // 🔹 Base58로 인코딩

    const appUrl = encodeURIComponent("https://www.catpresso.com");
    const redirectLink = encodeURIComponent("https://www.catpresso.com/wallet");

    // ✅ 올바른 Phantom 딥링크 URL
    const phantomDeepLink = `https://phantom.app/ul/v1/connect?dapp_encryption_public_key=${dappPublicKey}&cluster=mainnet-beta&app_url=${appUrl}&redirect_link=${redirectLink}`;

    console.log("📱 Phantom 딥링크 실행:", phantomDeepLink);

    // ✅ Phantom 앱 실행
    window.location.href = phantomDeepLink;
  };

  // ✅ 데스크톱 & 모바일 구분 후 연결 실행
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

