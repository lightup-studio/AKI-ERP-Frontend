import { memo } from 'react';

import { useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { RootState } from 'src/app/store';

import routes from '../routes/sidebar';
import SidebarSubmenu from './SidebarSubmenu';

const LeftSidebar = memo(() => {
  const { currentTheme } = useSelector((state: RootState) => state.settings);
  const location = useLocation();

  return (
    <div className="drawer-side">
      <label htmlFor="left-sidebar-drawer" className="drawer-overlay"></label>
      <ul className="menu gap-2 pt-2 w-80 bg-base-100 text-base-content h-full">
        <li className="mb-2 font-semibold text-xl">
          <img src={`/assets/${currentTheme}/logo.svg`} alt="AKI ERP" />
        </li>
        {routes.map((route, k) => (
          <li className="" key={k}>
            {route.groupName ? (
              <div className="px-4 py-2 font-bold text-lg bg-accent hover:bg-accent tracking-widest text-base-100">
                {route.groupName}
              </div>
            ) : route.submenu ? (
              <SidebarSubmenu {...route} />
            ) : (
              <NavLink
                end
                to={route.path || ''}
                className={({ isActive }) =>
                  `${isActive ? 'font-semibold  bg-base-200' : 'font-normal'}`
                }
              >
                {route?.icon} {route.name}
                {route.path && location.pathname.startsWith(route.path) ? (
                  <span
                    className="absolute inset-y-0 left-0 w-1 rounded-tr-md rounded-br-md bg-primary "
                    aria-hidden="true"
                  ></span>
                ) : null}
              </NavLink>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
});

export default LeftSidebar;
