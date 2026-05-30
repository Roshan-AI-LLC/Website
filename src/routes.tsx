import type { RouteRecord } from 'vite-react-ssg';
import Layout from './Layout';
import Home from './pages/Home';
import ProductsIndex from './pages/products/Index';
import ShifaMindProduct from './pages/products/ShifaMind';
import NabzGraphProduct from './pages/products/NabzGraph';
import Platform from './pages/Platform';
import Developers from './pages/Developers';
import CompanyAbout from './pages/company/About';
import CompanyTeam from './pages/company/Team';
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
          { path: 'nabzgraph', Component: NabzGraphProduct, entry: 'src/pages/products/NabzGraph.tsx' },
        ],
      },
      { path: 'platform', Component: Platform, entry: 'src/pages/Platform.tsx' },
      { path: 'developers', Component: Developers, entry: 'src/pages/Developers.tsx' },
      {
        path: 'company',
        children: [
          { path: 'about', Component: CompanyAbout, entry: 'src/pages/company/About.tsx' },
          { path: 'team', Component: CompanyTeam, entry: 'src/pages/company/Team.tsx' },
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
