import { useState, useRef, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import CustomWalletModal from '@/components/CustomWalletModal';

export default function CustomWalletButton() {
  const { t } = useTranslation();
  const { connecting, connected, disconnect, publicKey, wallet } = useWallet();
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const shortAddress = publicKey
    ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
    : '';

  const handleClick = () => {
    if (!connected && !connecting) setModalOpen(true);
    else if (connected) setMenuOpen((prev) => !prev);
  };

  const handleCopy = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toBase58());
      alert(t('wallet.copied'));
    }
    setMenuOpen(false);
  };

  const handleChange = () => {
    if (!connecting) {
      setModalOpen(true);
      setMenuOpen(false);
    }
  };

  const handleDisconnect = async () => {
    await disconnect();
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={handleClick}
        className="wallet-adapter-button wallet-adapter-button-trigger flex items-center gap-3"
        disabled={connecting} // 連線中禁止點擊
      >
        {connected && wallet?.adapter.icon && (
          <img
            src={wallet.adapter.icon}
            alt={wallet.adapter.name}
            className="w-6 h-6"
          />
        )}
        {connecting
          ? t('wallet.connecting') // 顯示 Connecting...
          : connected
            ? shortAddress
            : t('wallet.connect')}
      </button>

      {/* Dropdown Menu */}
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

      {/* Render Modal */}
      <CustomWalletModal
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
