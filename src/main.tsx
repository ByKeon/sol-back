import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@/i18n';

import { App } from '@/App';
import '@/tailwind.css';

import { initLocale } from '@/utils/switchLocale';

(async () => {
  await initLocale();
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
})();
