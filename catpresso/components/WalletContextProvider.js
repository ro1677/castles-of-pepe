// WalletContextProvider.js
import { clusterApiUrl } from "@solana/web3.js";
import { useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

// 자동 등록 방식을 사용하여 wallet‑standard에서 Phantom을 자동으로 등록하도록 함.
// wallets 배열을 빈 배열로 두어 중복 등록 문제를 방지합니다.
export default function WalletContextProvider({ children }) {
  const endpoint = useMemo(() => clusterApiUrl("devnet"), []);
  const wallets = useMemo(() => [], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      {/* autoConnect 옵션을 제거하여 수동 연결 방식 유지 */}
      <WalletProvider wallets={wallets}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

