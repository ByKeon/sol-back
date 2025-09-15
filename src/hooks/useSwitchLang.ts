import { toast } from 'react-hot-toast';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { type TYPE_Lang } from '@/config/TYPE_Lang';
import { switchLocale } from '@/utils/switchLocale';

export function useSwitchLang() {
  const { i18n, t } = useTranslation();
  const [prevLang, setPrevLang] = useState(i18n.language);

  return useCallback(
    async (nextLang: TYPE_Lang) => {
      if (nextLang !== prevLang) {
        setPrevLang(nextLang);
        await switchLocale(nextLang);
        toast.success(t('toast.languageSwitched'));
      }
    },
    [t, prevLang]
  );
}
