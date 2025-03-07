import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { clusterApiUrl } from "@solana/web3.js";
import { useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

// 주의: 만약 @solana/wallet-standard 등에서 Phantom이 이미 등록되어 있다면, 
// 해당 어댑터와 중복되지 않도록 설정(또는 제거)해야 합니다.
export default function WalletContextProvider({ children }) {
  const endpoint = useMemo(() => clusterApiUrl("devnet"), []);
  const wallets = useMemo(() => [
    new PhantomWalletAdapter({
      deepLink: "https://phantom.app/ul/wallet",
      forceMobile: true,
    })
  ], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      {/* autoConnect 옵션 제거 → 수동 연결 */}
      <WalletProvider wallets={wallets}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

