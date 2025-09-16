// AssetsList.tsx
import { useState, useEffect, useMemo } from 'react';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';

const TOKENS = {
  SOL: 'SOL',
  USDT: new PublicKey('Es9vMFrzaCERz2XZCbC7fvyz2f1xwChn56k97Y8E9t9k'),
  USDC: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
};

// CoinGecko icon 對應
const COINGECKO_ICONS: Record<string, string> = {
  SOL: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
  USDT: 'https://assets.coingecko.com/coins/images/325/large/Tether-logo.png',
  USDC: 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png',
};

const getIcon = (symbol: string) =>
  COINGECKO_ICONS[symbol] || 'https://via.placeholder.com/20';

export default function AssetsList({ endpoint }: { endpoint: string }) {
  const { publicKey, connected } = useWallet();
  const [assets, setAssets] = useState<
    { mint: string; symbol: string; amount: number }[]
  >([]);
  const connection = useMemo(() => new Connection(endpoint), [endpoint]);

  useEffect(() => {
    if (!connected || !publicKey) {
      setAssets([]);
      return;
    }

    const fetchAssets = async () => {
      try {
        // SOL balance
        const solBalanceLamports = await connection.getBalance(publicKey);
        const solBalance = solBalanceLamports / LAMPORTS_PER_SOL;

        // SPL tokens
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
          publicKey,
          {
            programId: new PublicKey(
              'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
            ),
          }
        );

        const tokenAssets = tokenAccounts.value.map((t) => {
          const info = t.account.data.parsed.info;
          let symbol = info.mint;
          if (info.mint === TOKENS.USDT.toBase58()) symbol = 'USDT';
          else if (info.mint === TOKENS.USDC.toBase58()) symbol = 'USDC';
          return {
            mint: info.mint,
            symbol,
            amount: info.tokenAmount.uiAmount || 0,
          };
        });

        // 強制顯示 SOL、USDT、USDC
        const solAsset = { mint: 'SOL', symbol: 'SOL', amount: solBalance };
        const usdtAsset = tokenAssets.find((t) => t.symbol === 'USDT') || {
          mint: TOKENS.USDT.toBase58(),
          symbol: 'USDT',
          amount: 0,
        };
        const usdcAsset = tokenAssets.find((t) => t.symbol === 'USDC') || {
          mint: TOKENS.USDC.toBase58(),
          symbol: 'USDC',
          amount: 0,
        };

        const otherAssets = tokenAssets
          .filter((t) => !['SOL', 'USDT', 'USDC'].includes(t.symbol))
          .sort((a, b) => b.amount - a.amount);

        setAssets([solAsset, usdtAsset, usdcAsset, ...otherAssets]);
      } catch (err) {
        console.error('Fetch assets error:', err);
        setAssets([]);
      }
    };

    fetchAssets();
  }, [connected, publicKey, endpoint, connection]);

  if (!connected)
    return <p className="text-gray-500">No assets (disconnected)</p>;

  return (
    <div className="mt-6 w-full max-w-md">
      <h3 className="text-lg font-bold mb-2">Assets</h3>
      <ul className="space-y-1">
        {assets.map((a) => (
          <li
            key={a.mint}
            className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-800 rounded-md"
          >
            <div className="flex items-center gap-2">
              <img src={getIcon(a.symbol)} alt={a.symbol} className="w-6 h-6" />
              <span>{a.symbol}</span>
            </div>
            <span>{a.amount.toFixed(4)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
