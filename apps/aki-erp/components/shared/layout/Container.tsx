import LeftSidebar from './LeftSidebar';
import Navbar from './Navbar';

const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="drawer lg:drawer-open block lg:grid">
      <input id="left-sidebar-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex h-screen flex-col overflow-hidden">
        <Navbar />
        <main className="bg-base-200 relative flex-1 overflow-y-auto p-4">{children}</main>
      </div>

      <LeftSidebar />
    </div>
  );
};

export default Container;
