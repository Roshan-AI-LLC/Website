import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Background } from './components/Background';
import { Cursor } from './components/Cursor';
import { Footer } from './components/Footer';
import { Nav } from './components/Nav';

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  return (
    <div className="relative min-h-screen">
      <Background />
      <Cursor />
      <Nav />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
