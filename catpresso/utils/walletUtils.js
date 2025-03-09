export const isWalletConnected = (wallet) => {
  if (!window.solana || !window.solana.isPhantom) {
    console.warn("🚨 Phantom Wallet이 감지되지 않음.");
    return false;
  }
  
  return wallet && wallet.connected && wallet.publicKey !== null;
};

