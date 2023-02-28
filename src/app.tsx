import { lazy } from 'react';

import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';

import checkAuth from './app/auth';
import initializeApp from './app/init';

// Importing pages
const Layout = lazy(() => import('./containers/Layout'));
const Login = lazy(() => import('./pages/Login'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Documentation = lazy(() => import('./pages/Documentation'));

// Initializing different libraries
initializeApp();

// Check for login and initialize axios
const token = checkAuth();

const router = createBrowserRouter([
  {
    path: 'login',
    element: <Login />,
  },
  {
    path: 'forget-password',
    element: <ForgotPassword />,
  },
  {
    path: 'documentation',
    element: <Documentation />,
  },
  {
    path: '/app/*',
    element: <Layout />,
  },
  {
    path: '*',
    element: <Navigate to={token ? '/app/welcome' : '/login'} replace />,
  },
]);

export function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
