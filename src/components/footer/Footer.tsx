import clsx from 'clsx';
import { FOOT_HEIGHT } from '@/constants/getFootHeight';

export function Footer() {
  return (
    <footer
      className={clsx(
        'sticky bottom-0 z-10',
        'bg-blue-600 text-white shadow-lg',
        'px-4 py-2',
        'flex items-center justify-center'
      )}
      style={{ height: `${FOOT_HEIGHT}px` }}
    >
      <span>
        © {new Date().getFullYear()}{' '}
        <a
          href="https://bykeon.com/"
          className="hover:underline hover:text-yellow-300"
        >
          ByKeon.com
        </a>
      </span>
    </footer>
  );
}
