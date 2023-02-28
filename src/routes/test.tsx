import { lazy } from 'react';

import { RouteObject } from 'react-router-dom';

const Artworks = lazy(() => import('../pages/Artworks'));
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

const routes: RouteObject[] = [
  {
    path: '/artworks/*',
    async loader() {
      const res = await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({ status: 'success' });
        }, 3000);
      });
      return res;
    },
    element: <Artworks />,
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
    element: <Page404 />,
  },
];

export default routes;
