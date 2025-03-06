import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { clusterApiUrl } from "@solana/web3.js";
import { useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

export default function WalletContextProvider({ children }) {
  // 예: devnet을 사용 중이라면, 혹은 mainnet-beta로 변경 가능
  const endpoint = useMemo(() => clusterApiUrl("devnet"), []);
  const wallets = useMemo(() => [
    new PhantomWalletAdapter({
      deepLink: "https://phantom.app/ul/wallet", // Phantom 모바일 호출 URL
      forceMobile: true, // 모바일 환경에서 딥링크를 강제합니다.
    })
  ], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

