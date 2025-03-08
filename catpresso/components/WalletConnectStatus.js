// WalletConnectStatus.js
"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

export default function WalletConnectStatus() {
  const { publicKey, connected, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [showDisconnect, setShowDisconnect] = useState(false);

  const handleConnect = () => {
    // 모달만 열고 사용자가 선택하도록 합니다.
    setVisible(true);
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      setShowDisconnect(false);
    } catch (error) {
      alert(`지갑 연결 해제 오류: ${error.message}`);
    }
  };

  return !connected ? (
    <button
      onClick={handleConnect}
      className="bg-blue-500 px-3 py-1 rounded text-xs"
    >
      지갑 연결하기
    </button>
  ) : (
    <div className="relative inline-block">
      <button
        onClick={() => setShowDisconnect((prev) => !prev)}
        className="bg-green-500 px-3 py-1 rounded text-xs"
      >
        지갑 연결됨 ({publicKey.toString().slice(0, 4)}...)
      </button>
      {showDisconnect && (
        <button
          onClick={disconnect}
          className="absolute left-0 mt-1 bg-red-500 px-3 py-1 rounded text-xs"
        >
          연결 해제
        </button>
      )}
    </div>
  );
}

