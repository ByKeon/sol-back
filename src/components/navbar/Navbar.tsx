import { useState } from 'react';

import clsx from 'clsx';
import { SunIcon, MoonIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

import { WebLangMenu } from '@/components/modal/WebLangMenu';

import { MENU_HEIGHT } from '@/constants/getMenuHeight';
import { useSwitchTheme } from '@/hooks/useSwitchTheme';

export function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { webTheme, toggleWebTheme } = useSwitchTheme();

  return (
    <>
      <nav
        className={clsx(
          'sticky top-0 z-10',
          'bg-blue-600 text-white shadow-lg'
        )}
        style={{ height: `${MENU_HEIGHT}px` }}
      >
        <div
          className={clsx(
            'mx-auto max-w-[1024px] h-full',
            'px-6 py-3',
            'flex items-center justify-between'
          )}
        >
          <img src="/logo.png" alt="Logo" className="w-8 h-8" />
          <div className="flex items-center space-x-8">
            <button
              aria-label="Switch theme"
              onClick={toggleWebTheme}
              className={clsx('w-8 h-8', 'hover:bg-white hover:text-blue-600')}
            >
              {webTheme === 'dark' ? <MoonIcon /> : <SunIcon />}
            </button>

            <button
              aria-label="Language Menu"
              onClick={() => setIsModalOpen(true)}
              className={clsx('w-8 h-8', 'hover:bg-white hover:text-blue-600')}
            >
              <GlobeAltIcon />
            </button>
          </div>
        </div>
      </nav>

      <WebLangMenu
        isModalOpen={isModalOpen}
        onCloseModal={() => setIsModalOpen(false)}
      />
    </>
  );
}
