// WalletContextProvider.js
import { clusterApiUrl } from "@solana/web3.js";
import { useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

export default function WalletContextProvider({ children }) {
  const endpoint = useMemo(() => clusterApiUrl("devnet"), []);

  // 자동 등록 방식으로 어댑터를 사용하므로 wallets 배열은 빈 배열로 설정
  const wallets = useMemo(() => [], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      {/* autoConnect 옵션을 제거하여 수동 연결을 유지 */}
      <WalletProvider wallets={wallets}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

