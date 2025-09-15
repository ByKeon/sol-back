import { useMemo } from 'react';
import { clusterApiUrl } from '@solana/web3.js';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import {
  WalletModalProvider,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';

import '@solana/wallet-adapter-react-ui/styles.css';

export function MainPage() {
  const network = 'devnet';
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      {/* 不傳 wallets，讓系統自動偵測瀏覽器裡注入的錢包 */}
      <WalletProvider wallets={[]} autoConnect={true}>
        <WalletModalProvider>
          <div className="w-full flex justify-center p-8 gap-12">
            <h2>Solana Wallet Connect 範例</h2>
            <WalletMultiButton />
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
