// app/layout.js
"use client";

import React, { useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";

import "@solana/wallet-adapter-react-ui/styles.css";
import "@/styles/globals.css";

export default function RootLayout({ children }) {
  // ✅ 메인넷 사용
  const endpoint = useMemo(() => clusterApiUrl("mainnet-beta"), []);

  // ✅ 자동 감지 방식으로 변경 (수동 등록 제거)
  const wallets = useMemo(() => [], []);  

  return (
    <html lang="ko">
      <body className="bg-backgroundGray min-h-screen">
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect={false}>
            <WalletModalProvider>{children}</WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </body>
    </html>
  );
}

