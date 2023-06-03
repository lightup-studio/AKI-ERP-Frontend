import './SidebarSubmenu.scss';

import { useEffect, useState, memo } from 'react';

import classNames from 'classnames';
import { Link, useLocation } from 'react-router-dom';

import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon';

export interface SubMenuItem {
  path: string;
  name: string;
}

export interface SidebarSubmenuProps {
  submenu: SubMenuItem[];
  path: string;
  name: string;
  icon?: string;
}

const SidebarSubmenu = memo(
  ({ submenu, path, name, icon }: SidebarSubmenuProps) => {
    const location = useLocation();
    const [isExpanded, setIsExpanded] = useState(false);

    /** Open Submenu list if path found in routes, this is for directly loading submenu routes  first time */
    useEffect(() => {
      if (
        location.pathname.startsWith(path || '') ||
        submenu.filter((m) => {
          return location.pathname.startsWith(m.path);
        })[0]
      )
        setIsExpanded(true);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <details open={isExpanded}>
        <summary
          className={classNames('flex pl-0 py-0', {
            'bg-base-200': location.pathname.startsWith(path || ''),
          })}
        >
          <Link
            className="flex-grow pl-4 py-3 relative"
            to={path || ''}
          >
            {icon} {name}
            {location.pathname.startsWith(path || '') ? (
              <span
                className="absolute inset-y-0 left-0 w-1 rounded-tr-md rounded-br-md bg-primary "
                aria-hidden="true"
              ></span>
            ) : null}
          </Link>
        </summary>

        {/** Submenu list */}
        <ul className="ml-0">
          {submenu.map((m, k) => (
            <li
              key={k}
              className={
                location.pathname.startsWith(m.path) ? 'bg-base-200' : ''
              }
            >
              <Link to={m.path}>
                {m.name}
                {location.pathname.startsWith(m.path) ? (
                  <span
                    className="absolute inset-y-0 left-0 w-1 rounded-tr-md rounded-br-md bg-primary "
                    aria-hidden="true"
                  ></span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      </details>
    );
  }
);

export default SidebarSubmenu;
