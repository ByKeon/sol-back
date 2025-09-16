// MainPage.tsx
import { useState, useMemo } from 'react';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import {
  WalletModalProvider,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import CustomWalletButton from '@/components/CustomWalletButton';
import AssetsList from '@/components/AssetsList';

import '@solana/wallet-adapter-react-ui/styles.css';

export function MainPage() {
  const [network, setNetwork] = useState<'devnet' | 'mainnet-beta'>('devnet');

  const endpoint = useMemo(() => {
    switch (network) {
      case 'devnet':
        return 'https://api.devnet.solana.com';
      case 'mainnet-beta':
        return 'https://solana-rpc.publicnode.com';
      default:
        return 'https://api.devnet.solana.com';
    }
  }, [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect={true}>
        <WalletModalProvider>
          <div className="flex flex-col items-center gap-6 p-8">
            <h2 className="text-xl font-bold mb-4">Solana Wallet Connect 範例</h2>

            {/* Network 切換 */}
            <div className="mb-4">
              <button
                className={`px-4 py-2 mr-2 rounded ${network === 'devnet' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setNetwork('devnet')}
              >
                Devnet
              </button>
              <button
                className={`px-4 py-2 rounded ${network === 'mainnet-beta' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setNetwork('mainnet-beta')}
              >
                Mainnet
              </button>
            </div>

            <div className="flex flex-row gap-6">
              <WalletMultiButton />
              <CustomWalletButton />
            </div>

            <AssetsList endpoint={endpoint} />
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
