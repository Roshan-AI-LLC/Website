import type { RouteRecord } from 'vite-react-ssg';
import Layout from './Layout';
import Home from './pages/Home';
import ProductsIndex from './pages/products/Index';
import ShifaMindProduct from './pages/products/ShifaMind';
import NabzFamily from './pages/products/nabz/Index';
import NabzGraphProduct from './pages/products/nabz/Graph';
import NabzSentryProduct from './pages/products/nabz/Sentry';
import Platform from './pages/Platform';
import Developers from './pages/Developers';
import CompanyAbout from './pages/company/About';
import CompanyTeam from './pages/company/Team';
import CompanyPress from './pages/company/Press';
import CompanyPressRelease from './pages/company/PressRelease';
import { PRESS_RELEASES } from './data/press';
import Contact from './pages/Contact';
import Privacy from './pages/legal/Privacy';
import Terms from './pages/legal/Terms';
import NotFound from './pages/NotFound';

export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <Layout />,
    entry: 'src/Layout.tsx',
    children: [
      { index: true, Component: Home, entry: 'src/pages/Home.tsx' },
      {
        path: 'products',
        children: [
          { index: true, Component: ProductsIndex, entry: 'src/pages/products/Index.tsx' },
          { path: 'shifamind', Component: ShifaMindProduct, entry: 'src/pages/products/ShifaMind.tsx' },
          {
            path: 'nabz',
            children: [
              { index: true, Component: NabzFamily, entry: 'src/pages/products/nabz/Index.tsx' },
              { path: 'graph', Component: NabzGraphProduct, entry: 'src/pages/products/nabz/Graph.tsx' },
              { path: 'sentry', Component: NabzSentryProduct, entry: 'src/pages/products/nabz/Sentry.tsx' },
            ],
          },
        ],
      },
      { path: 'platform', Component: Platform, entry: 'src/pages/Platform.tsx' },
      { path: 'developers', Component: Developers, entry: 'src/pages/Developers.tsx' },
      {
        path: 'company',
        children: [
          { path: 'about', Component: CompanyAbout, entry: 'src/pages/company/About.tsx' },
          { path: 'team', Component: CompanyTeam, entry: 'src/pages/company/Team.tsx' },
          {
            path: 'press',
            children: [
              { index: true, Component: CompanyPress, entry: 'src/pages/company/Press.tsx' },
              {
                path: ':slug',
                Component: CompanyPressRelease,
                entry: 'src/pages/company/PressRelease.tsx',
                // Prerenders one static page per release.
                getStaticPaths: () => PRESS_RELEASES.map((r) => r.slug),
              },
            ],
          },
          {
            // Lazy: the blog pages, their components and the post data load
            // only on blog URLs, not with every page. On first load
            // vite-react-ssg resolves the matched lazy route before hydrating,
            // and each `entry` makes the prerendered HTML modulepreload that
            // module's chunk: the page's own, plus (from this parent) the
            // shared post-data chunk, so hydration does not wait on a second
            // round trip. Nothing here may import ./data/blog statically, or
            // the posts land back in the main chunk.
            path: 'blog',
            entry: 'src/data/blog.ts',
            children: [
              {
                index: true,
                lazy: async () => ({ Component: (await import('./pages/company/Blog')).default }),
                entry: 'src/pages/company/Blog.tsx',
              },
              {
                path: ':slug',
                lazy: async () => ({ Component: (await import('./pages/company/BlogPost')).default }),
                entry: 'src/pages/company/BlogPost.tsx',
                // Prerenders one static page per post (runs only at build time).
                getStaticPaths: async () => (await import('./data/blog')).BLOG_POSTS.map((p) => p.slug),
              },
            ],
          },
        ],
      },
      { path: 'contact', Component: Contact, entry: 'src/pages/Contact.tsx' },
      {
        path: 'legal',
        children: [
          { path: 'privacy', Component: Privacy, entry: 'src/pages/legal/Privacy.tsx' },
          { path: 'terms', Component: Terms, entry: 'src/pages/legal/Terms.tsx' },
        ],
      },
      { path: '*', Component: NotFound, entry: 'src/pages/NotFound.tsx' },
    ],
  },
];
