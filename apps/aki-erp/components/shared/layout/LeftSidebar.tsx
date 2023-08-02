'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from '../Image';
import SidebarSubmenu from './SidebarSubmenu';

const routes = [
  {
    icon: '',
    groupName: '藝術作品',
  },
  {
    path: '/artworks',
    name: '庫存',
  },
  {
    path: '/disabled-artworks',
    name: '非庫存',
  },
  {
    path: '/draft-artworks',
    name: '草稿',
  },
  {
    groupName: '進銷存',
  },
  {
    path: '/purchase/orders',
    name: '進貨單',
    submenu: [
      {
        path: '/purchase/return-orders',
        name: '進貨退還單',
      },
    ],
  },
  {
    path: '/transfer/orders',
    name: '調撥單',
  },
  {
    path: '/lend/orders',
    name: '借出單',
    submenu: [
      {
        path: '/lend/return-orders',
        name: '借出歸還單',
      },
    ],
  },
  {
    path: '/repair/orders',
    name: '維修單',
    submenu: [
      {
        path: '/repair/return-orders',
        name: '維修歸還單',
      },
    ],
  },
  {
    path: '/shipment/orders',
    name: '出貨單',
    submenu: [
      {
        path: '/shipment/return-orders',
        name: '退貨單',
      },
    ],
  },
  {
    groupName: '周邊/器材',
  },

  {
    groupName: '通用資訊',
  },
  {
    path: '/artists',
    name: '藝術家',
  },
  {
    path: '/collector',
    name: '藏家',
  },
  {
    path: '/company',
    name: '廠商',
  },
  // {
  //   path: '/dashboard',
  //   icon: <Squares2X2Icon className={iconClasses} />,
  //   name: 'Dashboard',
  // },
  // {
  //   path: '/leads', // url
  //   icon: <InboxArrowDownIcon className={iconClasses} />, // icon component
  //   name: 'Leads', // name that appear in Sidebar
  // },
  // {
  //   path: '/charts', // url
  //   icon: <ChartBarIcon className={iconClasses} />, // icon component
  //   name: 'Charts', // name that appear in Sidebar
  // },
  // {
  //   path: '/integration', // url
  //   icon: <BoltIcon className={iconClasses} />, // icon component
  //   name: 'Integration', // name that appear in Sidebar
  // },

  // {
  //   path: '', //no url needed as this has submenu
  //   icon: <DocumentDuplicateIcon className={`${iconClasses} inline`} />, // icon component
  //   name: 'Pages', // name that appear in Sidebar
  //   submenu: [
  //     {
  //       path: '/login',
  //       icon: <ArrowRightOnRectangleIcon className={submenuIconClasses} />,
  //       name: 'Login',
  //     },
  //     {
  //       path: '/register', //url
  //       icon: <UserIcon className={submenuIconClasses} />, // icon component
  //       name: 'Register', // name that appear in Sidebar
  //     },
  //     {
  //       path: '/forgot-password',
  //       icon: <KeyIcon className={submenuIconClasses} />,
  //       name: 'Forgot Password',
  //     },
  //     {
  //       path: '/blank',
  //       icon: <DocumentIcon className={submenuIconClasses} />,
  //       name: 'Blank Page',
  //     },
  //     {
  //       path: '/404',
  //       icon: <ExclamationTriangleIcon className={submenuIconClasses} />,
  //       name: '404',
  //     },
  //   ],
  // },
  // {
  //   path: '', //no url needed as this has submenu
  //   icon: <Cog6ToothIcon className={`${iconClasses} inline`} />, // icon component
  //   name: 'Settings', // name that appear in Sidebar
  //   submenu: [
  //     {
  //       path: '/settings-profile', //url
  //       icon: <UserIcon className={submenuIconClasses} />, // icon component
  //       name: 'Profile', // name that appear in Sidebar
  //     },
  //     {
  //       path: '/settings-billing',
  //       icon: <WalletIcon className={submenuIconClasses} />,
  //       name: 'Billing',
  //     },
  //     {
  //       path: '/settings-team', // url
  //       icon: <UsersIcon className={submenuIconClasses} />, // icon component
  //       name: 'Team Members', // name that appear in Sidebar
  //     },
  //   ],
  // },
  // {
  //   path: '', //no url needed as this has submenu
  //   icon: <DocumentTextIcon className={`${iconClasses} inline`} />, // icon component
  //   name: 'Documentation', // name that appear in Sidebar
  //   submenu: [
  //     {
  //       path: '/getting-started', // url
  //       icon: <DocumentTextIcon className={submenuIconClasses} />, // icon component
  //       name: 'Getting Started', // name that appear in Sidebar
  //     },
  //     {
  //       path: '/features',
  //       icon: <TableCellsIcon className={submenuIconClasses} />,
  //       name: 'Features',
  //     },
  //     {
  //       path: '/components',
  //       icon: <CodeBracketSquareIcon className={submenuIconClasses} />,
  //       name: 'Components',
  //     },
  //   ],
  // },
];

const LeftSidebar = () => {
  const pathName = usePathname();

  return (
    <div className="drawer-side">
      <label htmlFor="left-sidebar-drawer" className="drawer-overlay"></label>

      <ul className="menu gap-2 pt-2 w-80 bg-base-100 text-base-content h-full flex-nowrap">
        <li className="py-2 font-semibold text-xl">
          <div className="p-0">
            <Image src="/images/dark/logo.svg" alt="AKI ERP" width="177px" height="34.5px" />
          </div>
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
              <Link
                href={route.path || ''}
                // className={({ isActive }) =>
                //   `${isActive ? 'font-semibold  bg-base-200' : 'font-normal'}`
                // }
              >
                {route?.icon} {route.name}
                {route.path && pathName.startsWith(route.path) ? (
                  <span
                    className="absolute inset-y-0 left-0 w-1 rounded-tr-md rounded-br-md bg-primary "
                    aria-hidden="true"
                  ></span>
                ) : null}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeftSidebar;
