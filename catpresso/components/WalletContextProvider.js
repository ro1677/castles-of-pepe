// WalletContextProvider.js
import { clusterApiUrl } from "@solana/web3.js";
import { useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

export default function WalletContextProvider({ children }) {
  const endpoint = useMemo(() => clusterApiUrl("devnet"), []);

  // 자동 등록 방식을 사용하기 위해, wallets 배열을 빈 배열로 설정합니다.
  const wallets = useMemo(() => [], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      {/* autoConnect 옵션은 제거하여 수동 연결 방식으로 유지합니다. */}
      <WalletProvider wallets={wallets}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

