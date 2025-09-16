import { useMemo, useState, useRef, useEffect } from 'react';
import { clusterApiUrl } from '@solana/web3.js';
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from '@solana/wallet-adapter-react';
import {
  WalletModalProvider,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

import '@solana/wallet-adapter-react-ui/styles.css';

export function MainPage() {
  const network = 'devnet';
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect={true}>
        <WalletModalProvider>
          <div className="flex flex-col items-center gap-6 p-8">
            <h2 className="text-xl font-bold mb-4">
              Solana Wallet Connect 範例
            </h2>

            <div className="flex flex-row gap-6">
              <WalletMultiButton />
              <CustomWalletButton onOpenModal={() => setModalOpen(true)} />
            </div>
          </div>

          {/* 自訂 Modal */}
          <CustomWalletModal
            visible={modalOpen}
            onClose={() => setModalOpen(false)}
          />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

/* ---------------- 自訂 Wallet Button ---------------- */
function CustomWalletButton({ onOpenModal }: { onOpenModal: () => void }) {
  const { t } = useTranslation();
  const { connected, publicKey, disconnect, wallet } = useWallet();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const shortAddress = publicKey
    ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
    : '';

  const handleClick = () => {
    if (!connected) {
      onOpenModal();
    } else {
      setMenuOpen((prev) => !prev);
    }
  };

  const handleCopy = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toBase58());
      alert(t('wallet.copied'));
    }
    setMenuOpen(false);
  };

  const handleChange = () => {
    onOpenModal();
    setMenuOpen(false);
  };

  const handleDisconnect = async () => {
    await disconnect();
    setMenuOpen(false);
  };

  // 點擊外部自動關閉
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={handleClick}
        className="wallet-adapter-button wallet-adapter-button-trigger flex items-center gap-3"
      >
        {connected && wallet?.adapter.icon && (
          <img
            src={wallet.adapter.icon}
            alt={wallet.adapter.name}
            className="w-6 h-6"
          />
        )}
        {connected ? shortAddress : t('wallet.connect')}
      </button>

      <AnimatePresence>
        {menuOpen && connected && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="wallet-adapter-dropdown-list wallet-adapter-dropdown-list-active absolute mt-2 right-0 z-50"
          >
            <button
              className="wallet-adapter-dropdown-list-item"
              onClick={handleCopy}
            >
              {t('wallet.copy')}
            </button>
            <button
              className="wallet-adapter-dropdown-list-item"
              onClick={handleChange}
            >
              {t('wallet.change')}
            </button>
            <button
              className="wallet-adapter-dropdown-list-item"
              onClick={handleDisconnect}
            >
              {t('wallet.disconnect')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- 自訂 Wallet Modal ---------------- */
function CustomWalletModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const { wallets, select } = useWallet();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl w-96 shadow-lg"
          >
            <h3 className="text-lg font-bold mb-4">{t('wallet.select')}</h3>
            <ul className="space-y-3">
              {wallets.map(({ adapter }) => (
                <li key={adapter.name}>
                  <button
                    className="flex items-center gap-3 p-3 w-full hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    onClick={() => {
                      select(adapter.name);
                      onClose();
                    }}
                  >
                    <img
                      src={adapter.icon}
                      alt={adapter.name}
                      className="w-6 h-6"
                    />
                    {adapter.name}
                  </button>
                </li>
              ))}
            </ul>
            <button
              className="mt-4 w-full p-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
              onClick={onClose}
            >
              {t('wallet.close')}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
