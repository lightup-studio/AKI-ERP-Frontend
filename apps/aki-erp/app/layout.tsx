'use client';

import store from '@contexts/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import './global.css';

const queryClient = new QueryClient();

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <html lang="en">
          <body>{children}</body>
        </html>
      </QueryClientProvider>
    </Provider>
  );
};

export default RootLayout;
