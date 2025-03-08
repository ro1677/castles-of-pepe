// utils/walletUtils.js
export const isWalletConnected = (wallet) => {
  // wallet은 useWallet() 훅에서 얻은 값입니다.
  return wallet && wallet.connected && wallet.publicKey !== null;
};


