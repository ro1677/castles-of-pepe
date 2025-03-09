import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

export default function WalletConnectStatus() {
  const { publicKey, connected, connect, disconnect, select } = useWallet();
  const { setVisible } = useWalletModal();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ✅ Phantom 모바일 딥링크 연결 함수
  const connectMobileWallet = () => {
    const dappUrl = encodeURIComponent("https://www.catpresso.com");
    const redirectUrl = encodeURIComponent("https://www.catpresso.com/wallet");
    const phantomUrl = `https://phantom.app/ul/v1/connect?app_url=${dappUrl}&redirect_link=${redirectUrl}`;

    console.log("📱 Phantom 딥링크 실행:", phantomUrl);
    window.location.href = phantomUrl; // ✅ Phantom 앱 실행
  };

  // ✅ 데스크톱 & 모바일 구분 후 연결 실행
  const connectWallet = async () => {
    try {
      setErrorMessage("");
      setLoading(true);

      const isMobile = /Android|iPhone/i.test(navigator.userAgent);

      if (isMobile) {
        connectMobileWallet();
      } else {
        console.log("🟢 지갑 선택창 열기");
        setVisible(true);
      }
    } catch (error) {
      console.error("❌ 지갑 연결 실패:", error);
      setErrorMessage("지갑 연결이 거부되었습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {!connected ? (
        <>
          <button
            onClick={connectWallet}
            className={`bg-blue-500 px-3 py-1 rounded text-xs ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            {loading ? "연결중..." : "지갑 연결하기"}
          </button>
          {errorMessage && <p className="text-red-500 text-xs mt-1">{errorMessage}</p>}
        </>
      ) : (
        <div>
          <button
            onClick={() => disconnect()}
            className="bg-green-500 px-3 py-1 rounded text-xs"
          >
            연결 해제 ({publicKey?.toString().slice(0, 4)}...)
          </button>
        </div>
      )}
    </div>
  );
}

