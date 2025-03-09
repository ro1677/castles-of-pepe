// ✅ components/WalletConnectStatus.js
"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

export default function WalletConnectStatus() {
  const { publicKey, connected, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [showDisconnect, setShowDisconnect] = useState(false);

  return !connected ? (
    <button onClick={() => setVisible(true)}>
      지갑 연결하기
    </button>
  ) : (
    <div>
      <button onClick={() => setShowDisconnect((prev) => !prev)}>
        연결됨 ({publicKey.toString().slice(0, 4)}...)
      </button>
      {showDisconnect && (
        <button onClick={disconnect}>
          연결 해제
        </button>
      )}
    </div>
  );
}

