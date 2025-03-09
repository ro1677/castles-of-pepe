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
    try {
      // 🔹 Phantom이 요구하는 DApp 공개 키 생성
      const dappKeyPair = nacl.box.keyPair(); 
      const dappPublicKey = bs58.encode(dappKeyPair.publicKey);

      const appUrl = encodeURIComponent("https://www.catpresso.com");

      // ✅ Universal Link 지원 가능 여부에 따라 선택
      const redirectLink = encodeURIComponent("myapp://onPhantomConnected"); // 앱 딥링크
      // const redirectLink = encodeURIComponent("https://www.catpresso.com/wallet"); // 웹 리디렉션

      // ✅ 올바른 Phantom 딥링크 URL 적용 (phantom.app 사용)
      const phantomDeepLink = `https://phantom.app/ul/v1/connect?dapp_encryption_public_key=${dappPublicKey}&cluster=mainnet-beta&app_url=${appUrl}&redirect_link=${redirectLink}`;

      console.log("📱 Phantom 딥링크 실행:", phantomDeepLink);

      // ✅ Phantom 앱 실행
      window.location.href = phantomDeepLink;
    } catch (error) {
      console.error("❌ Phantom 연결 오류:", error);
    }
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

