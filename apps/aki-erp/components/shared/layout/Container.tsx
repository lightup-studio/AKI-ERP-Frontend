'use client';

import store from '@contexts/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import LeftSidebar from './LeftSidebar';
import Navbar from './Navbar';

const queryClient = new QueryClient();

const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <div className="drawer block lg:drawer-open lg:grid">
          <input id="left-sidebar-drawer" type="checkbox" className="drawer-toggle" />

          <div className="drawer-content flex flex-col h-screen overflow-hidden">
            <Navbar />
            <main className="flex-1 overflow-y-auto pt-4 px-4 bg-base-200 relative">
              {children}
            </main>
          </div>

          <LeftSidebar />
        </div>
      </QueryClientProvider>
    </Provider>
  );
};

export default Container;
