import { Toaster } from 'react-hot-toast';
import { Navbar } from '@/components/navbar/Navbar';
import { MainPage } from '@/pages/MainPage';
import { Footer } from '@/components/footer/Footer';
import clsx from 'clsx';

export function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Toaster position="top-center" />
      <Navbar />
      <main
        className={clsx(
          'flex-1',
          'flex',
          'bg-white text-black',
          'dark:bg-gray-900 dark:text-white'
        )}
      >
        <MainPage />
      </main>
      <Footer />
    </div>
  );
}
