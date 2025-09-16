// AssetsList.tsx
import { useState, useEffect, useMemo } from 'react';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';

const TOKENS = {
  USDT: new PublicKey('Es9vMFrzaCERz2XZCbC7fvyz2f1xwChn56k97Y8E9t9k'), // mainnet USDT
  USDC: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'), // mainnet USDC
};

export default function AssetsList({ endpoint }: { endpoint: string }) {
  const { publicKey, connected } = useWallet();
  const [assets, setAssets] = useState<{ mint: string; symbol: string; amount: number }[]>([]);

  const connection = useMemo(() => new Connection(endpoint), [endpoint]);

  useEffect(() => {
    if (!connected || !publicKey) {
      setAssets([]);
      return;
    }

    const fetchAssets = async () => {
      try {
        // SOL
        const solBalanceLamports = await connection.getBalance(publicKey);
        const solBalance = solBalanceLamports / LAMPORTS_PER_SOL;

        // SPL Tokens
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
          programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
        });

        const tokenAssets = tokenAccounts.value.map((t) => {
          const info = t.account.data.parsed.info;
          const symbol =
            info.mint === TOKENS.USDT.toBase58()
              ? 'USDT'
              : info.mint === TOKENS.USDC.toBase58()
              ? 'USDC'
              : info.mint.slice(0, 6);
          return { mint: info.mint, symbol, amount: info.tokenAmount.uiAmount || 0 };
        });

        const ordered = [
          { mint: 'SOL', symbol: 'SOL', amount: solBalance },
          ...tokenAssets.filter((t) => t.symbol === 'USDT'),
          ...tokenAssets.filter((t) => t.symbol === 'USDC'),
          ...tokenAssets.filter((t) => !['USDT', 'USDC'].includes(t.symbol)),
        ];

        setAssets(ordered);
      } catch (err) {
        console.error('Fetch assets error:', err);
        setAssets([]);
      }
    };

    fetchAssets();
  }, [connected, publicKey, endpoint, connection]);

  if (!connected) return <p className="text-gray-500">No assets (disconnected)</p>;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold mb-2">Assets</h3>
      <ul className="space-y-1">
        {assets.map((a) => (
          <li key={a.mint} className="flex justify-between">
            <span>{a.symbol}</span>
            <span>{a.amount.toFixed(4)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
