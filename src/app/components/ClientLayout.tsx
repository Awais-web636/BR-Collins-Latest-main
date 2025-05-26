'use client';

import { usePathname } from 'next/navigation';
import { Navigation } from './Navigation';
import Footer from './Footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideLayout = pathname === '/login' || pathname === '/register';

  return (
    <>
      {!hideLayout && <Navigation />}
      {children}
      {!hideLayout && <Footer />}
    </>
  );
}
