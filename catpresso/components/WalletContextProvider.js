"use client"; // ✅ 클라이언트 전용 컴포넌트

import { useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { clusterApiUrl } from "@solana/web3.js";

export default function WalletContextProvider({ children }) {
  // Solana Devnet 연결 (필요하면 "mainnet-beta"로 변경)
  const endpoint = useMemo(() => clusterApiUrl("devnet"), []);

  // Phantom 지갑 어댑터 초기화 시 딥링크 옵션 추가
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter({
        deepLink: "https://phantom.app/ul/wallet", // 모바일에서 Phantom 앱 호출 URL
        // 필요한 경우 forceMobile 옵션을 추가할 수 있습니다.
        // forceMobile: true,
      }),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

