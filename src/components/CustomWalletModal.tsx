import { useWallet } from '@solana/wallet-adapter-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function CustomWalletModal({ visible, onClose }: Props) {
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
