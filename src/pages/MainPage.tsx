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
import CustomWalletButton from '@/components/CustomWalletButton';

export function MainPage() {
  const network = 'devnet';
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect={true}>
        {/* WalletModalProvider 只給官方 MultiButton 用；我們的 CustomModal 自己控管 */}
        <WalletModalProvider>
          <div className="flex flex-col items-center gap-6 p-8">
            <h2 className="text-xl font-bold mb-4">
              Solana Wallet Connect 範例
            </h2>

            <div className="flex flex-row gap-6">
              <WalletMultiButton />
              <CustomWalletButton />
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
