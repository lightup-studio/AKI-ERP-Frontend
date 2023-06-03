import useTheme from 'shared/hooks/useTheme';
import LeftSidebar from './LeftSidebar';
import ModalLayout from './ModalLayout';
import PageContent from './PageContent';
import RightSidebar from './RightSidebar';

function Layout() {
  const currentTheme = useTheme();

  return (
    <>
      {/* Left drawer - containing page content and side bar (always open) */}
      <div className="drawer lg:drawer-open">
        <input
          id="left-sidebar-drawer"
          type="checkbox"
          className="drawer-toggle"
        />
        <PageContent />
        <LeftSidebar currentTheme={currentTheme} />
      </div>

      {/* Right drawer - containing secondary content like notifications list etc.. */}
      <RightSidebar />

      {/* Modal layout container */}
      <ModalLayout />
    </>
  );
}

export default Layout;
