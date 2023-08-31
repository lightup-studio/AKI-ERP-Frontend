import LeftSidebar from './LeftSidebar';
import Navbar from './Navbar';

const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="drawer block lg:drawer-open lg:grid">
      <input id="left-sidebar-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col h-screen overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 bg-base-200 relative">{children}</main>
      </div>

      <LeftSidebar />
    </div>
  );
};

export default Container;
