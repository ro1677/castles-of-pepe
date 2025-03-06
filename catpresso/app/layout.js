"use client"; // 클라이언트 컴포넌트로 설정

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import React, { useMemo } from "react";
import "@/styles/globals.css"; // ✅ 절대 경로로 설정

export default function RootLayout({ children }) {
    // ✅ Solana Devnet 연결
    const network = WalletAdapterNetwork.Devnet;
    const endpoint = "https://api.devnet.solana.com";

    // ✅ 사용 가능한 지갑 목록
    const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

    return (
        <html lang="ko">
            <body>
                <ConnectionProvider endpoint={endpoint}>
                    <WalletProvider wallets={wallets} autoConnect>
                        <WalletModalProvider>{children}</WalletModalProvider>
                    </WalletProvider>
                </ConnectionProvider>
            </body>
        </html>
    );
}

