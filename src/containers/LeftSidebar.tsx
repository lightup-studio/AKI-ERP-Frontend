import { Link, NavLink, useLocation } from 'react-router-dom';

import routes from '../routes/sidebar';
import SidebarSubmenu from './SidebarSubmenu';

function LeftSidebar() {
  const location = useLocation();

  return (
    <div className="drawer-side ">
      <label htmlFor="left-sidebar-drawer" className="drawer-overlay"></label>
      <ul className="menu  pt-2 w-80 bg-base-100 text-base-content">
        <li className="mb-2 font-semibold text-xl">
          <Link to={'/app/welcome'}>
            <img
              className="mask mask-squircle w-10"
              src="/assets/logo192.png"
              alt="DashWind Logo"
            />
            DashWind
          </Link>{' '}
        </li>
        {routes.map((route, k) => {
          return (
            <li className="" key={k}>
              {route.groupName ? (
                <div className="p-4 font-bold text-lg bg-accent tracking-widest text-base-100">
                  {route.groupName}
                </div>
              ) : route.submenu ? (
                <SidebarSubmenu {...(route as any)} />
              ) : (
                <NavLink
                  end
                  to={route.path || ''}
                  className={({ isActive }) =>
                    `${
                      isActive ? 'font-semibold  bg-base-200 ' : 'font-normal'
                    }`
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
          );
        })}
      </ul>
    </div>
  );
}

export default LeftSidebar;
