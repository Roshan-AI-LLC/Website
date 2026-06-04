import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Background } from './components/Background';
import { Cursor } from './components/Cursor';
import { Footer } from './components/Footer';
import { Nav } from './components/Nav';

export default function Layout() {
  const { pathname } = useLocation();

  // Runs only after React has committed (i.e. hydration succeeded), which
  // cancels the scroll-reveal failsafe set up in index.html.
  useEffect(() => {
    (
      window as unknown as { __mzCancelRevealFallback?: () => void }
    ).__mzCancelRevealFallback?.();
  }, []);

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
