'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import cx from 'classnames';
import './SidebarSubmenu.scss';

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

const SidebarSubmenu = ({ submenu, path, name, icon }: SidebarSubmenuProps) => {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  /** Open Submenu list if path found in routes, this is for directly loading submenu routes  first time */
  useEffect(() => {
    if (
      pathname.startsWith(path || '') ||
      submenu.filter((m) => {
        return pathname.startsWith(m.path);
      })[0]
    )
      setIsExpanded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <details open={isExpanded}>
      <summary
        className={cx('flex py-0 pl-0', {
          'bg-base-200': pathname.startsWith(path || ''),
        })}
      >
        <Link className="relative flex-grow py-3 pl-4" href={path || ''}>
          {icon} {name}
          {pathname.startsWith(path || '') ? (
            <span
              className="bg-primary absolute inset-y-0 left-0 w-1 rounded-tr-md rounded-br-md "
              aria-hidden="true"
            ></span>
          ) : null}
        </Link>
      </summary>

      {/** Submenu list */}
      <ul className="ml-0">
        {submenu.map((m, k) => (
          <li key={k} className={pathname.startsWith(m.path) ? 'bg-base-200' : ''}>
            <Link href={m.path}>
              {m.name}
              {pathname.startsWith(m.path) ? (
                <span
                  className="bg-primary absolute inset-y-0 left-0 w-1 rounded-tr-md rounded-br-md "
                  aria-hidden="true"
                ></span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
};

export default SidebarSubmenu;
