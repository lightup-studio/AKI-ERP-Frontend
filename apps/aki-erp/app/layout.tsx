import { LeftSidebar, Navbar } from '@components/shared/layout';

import './global.css';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
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
      </body>
    </html>
  );
};

export default RootLayout;
