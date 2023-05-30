import { lazy } from 'react';

import { Navigate, RouteObject } from 'react-router-dom';
import checkAuth from 'src/app/auth';

const InventoryArtworks = lazy(
  () => import('../pages/artworks/InventoryArtworks')
);
const Artworks = lazy(() => import('../pages/artworks/Artworks'));
const DraftArtworks = lazy(() => import('../pages/artworks/DraftArtworks'));
const Dashboard = lazy(() => import('../pages/protected/Dashboard'));
const Welcome = lazy(() => import('../pages/protected/Welcome'));
const Page404 = lazy(() => import('../pages/protected/404'));
const Blank = lazy(() => import('../pages/protected/Blank'));
const Leads = lazy(() => import('../pages/protected/Leads'));
const ProfileSettings = lazy(
  () => import('../pages/protected/ProfileSettings')
);
const GettingStarted = lazy(() => import('../pages/GettingStarted'));
const DocFeatures = lazy(() => import('../pages/DocFeatures'));
const DocComponents = lazy(() => import('../pages/DocComponents'));

const token = checkAuth();

const routes: RouteObject[] = [
  {
    path: '/inventory-artworks/*',
    element: <InventoryArtworks />,
  },
  {
    path: '/artworks/*',
    element: <Artworks />,
  },
  {
    path: '/draft-artworks/*',
    element: <DraftArtworks />,
  },
  {
    path: '/dashboard', // the url
    element: <Dashboard />, // view rendered
  },
  {
    path: '/welcome', // the url
    element: <Welcome />, // view rendered
  },
  {
    path: '/leads',
    element: <Leads />,
  },
  {
    path: '/settings-profile',
    element: <ProfileSettings />,
  },
  {
    path: '/getting-started',
    element: <GettingStarted />,
  },
  {
    path: '/features',
    element: <DocFeatures />,
  },
  {
    path: '/components',
    element: <DocComponents />,
  },
  {
    path: '/404',
    element: <Page404 />,
  },
  {
    path: '/blank',
    element: <Blank />,
  },
  {
    path: '*',
    element: (
      <Navigate to={token ? '/app/inventory-artworks' : '/login'} replace />
    ),
  },
];

export default routes;
