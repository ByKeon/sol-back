import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';

import { LIST_Lang, type TYPE_Lang } from '@/config/TYPE_Lang';
import { useSwitchLang } from '@/hooks/useSwitchLang';

interface If_Modal_WebLang {
  isModalOpen: boolean;
  onCloseModal: () => void;
}

export function WebLangMenu({ isModalOpen, onCloseModal }: If_Modal_WebLang) {
  const { t, i18n } = useTranslation();
  const switchLang = useSwitchLang();
  const showKnownName = true;

  const onClickLang = (nextLang: TYPE_Lang) => {
    onCloseModal();
    switchLang(nextLang);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseModal();
    };
    if (isModalOpen) {
      window.addEventListener('keydown', handleKey);
    }
    return () => window.removeEventListener('keydown', handleKey);
  }, [isModalOpen, onCloseModal]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.delete('webLang');
    const newUrl =
      window.location.pathname +
      (params.toString() ? '?' + params.toString() : '') +
      window.location.hash;
    window.history.replaceState({}, '', newUrl);
  }, []);

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          className={clsx(
            'fixed inset-0 z-50',
            'bg-gray-500 bg-opacity-50',
            'flex justify-center items-center'
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCloseModal}
        >
          <motion.div
            className={clsx(
              'min-w-[250px] p-6 rounded shadow-lg',
              'max-h-[80vh] overflow-y-auto',
              'bg-blue-600 text-white'
            )}
            initial={{ y: '-100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold">
              {t('global.selectLanguage')}
            </h2>
            <hr className="my-4" />
            <ul className="space-y-2">
              {LIST_Lang.map((nextLang) => (
                <li key={nextLang}>
                  <button
                    onClick={() => onClickLang(nextLang as TYPE_Lang)}
                    className={clsx(
                      'w-full text-left px-3 py-2 rounded',
                      'hover-base hover:font-bold',
                      {
                        'font-bold bg-white text-blue-500':
                          i18n.language === nextLang,
                      }
                    )}
                  >
                    {t(`lang_local_name.${nextLang}`)}
                    {showKnownName && nextLang !== 'en' && (
                      <>
                        <br />
                        {t(`lang_known_name.${nextLang}`)}
                      </>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
