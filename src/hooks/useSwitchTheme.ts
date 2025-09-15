import { toast } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export function useSwitchTheme() {
  const { t } = useTranslation();
  const [webTheme, setWebTheme] = useState(
    localStorage.getItem('webTheme') || 'dark'
  );

  const toggleWebTheme = () => {
    const nextTheme = webTheme === 'dark' ? 'light' : 'dark';
    setWebTheme(nextTheme);
    toast.success(
      nextTheme === 'dark' ? t('toast.themeDark') : t('toast.themeLight')
    );
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlTheme = params.get('webTheme');

    if (urlTheme === 'dark' || urlTheme === 'light') {
      setWebTheme(urlTheme);
    }

    params.delete('webTheme');
    const newUrl =
      window.location.pathname +
      (params.toString() ? '?' + params.toString() : '') +
      window.location.hash;
    window.history.replaceState({}, '', newUrl);
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(webTheme);
    localStorage.setItem('webTheme', webTheme);
  }, [webTheme]);

  return { webTheme, toggleWebTheme };
}
