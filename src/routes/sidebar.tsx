// import ArrowRightOnRectangleIcon from '@heroicons/react/24/outline/ArrowRightOnRectangleIcon';
// import BoltIcon from '@heroicons/react/24/outline/BoltIcon';
// import ChartBarIcon from '@heroicons/react/24/outline/ChartBarIcon';
// import CodeBracketSquareIcon from '@heroicons/react/24/outline/CodeBracketSquareIcon';
// import Cog6ToothIcon from '@heroicons/react/24/outline/Cog6ToothIcon';
// import DocumentDuplicateIcon from '@heroicons/react/24/outline/DocumentDuplicateIcon';
// import DocumentIcon from '@heroicons/react/24/outline/DocumentIcon';
// import DocumentTextIcon from '@heroicons/react/24/outline/DocumentTextIcon';
// import ExclamationTriangleIcon from '@heroicons/react/24/outline/ExclamationTriangleIcon';
// import InboxArrowDownIcon from '@heroicons/react/24/outline/InboxArrowDownIcon';
// import KeyIcon from '@heroicons/react/24/outline/KeyIcon';
// import Squares2X2Icon from '@heroicons/react/24/outline/Squares2X2Icon';
// import TableCellsIcon from '@heroicons/react/24/outline/TableCellsIcon';
// import UserIcon from '@heroicons/react/24/outline/UserIcon';
// import UsersIcon from '@heroicons/react/24/outline/UsersIcon';
// import WalletIcon from '@heroicons/react/24/outline/WalletIcon';

// const iconClasses = `h-6 w-6`;
// const submenuIconClasses = `h-5 w-5`;

const routes = [
  {
    icon: '',
    groupName: '藝術作品',
  },
  {
    path: '/app/inventory-artworks',
    name: '庫存',
  },
  {
    path: '/app/artworks',
    name: '非庫存',
  },
  {
    path: '/app/draft-artworks',
    name: '草稿',
  },

  {
    groupName: '進銷存',
  },
  {
    path: '/app/purchase-order',
    name: '進貨單',
    submenu: [{ path: '/app/purchase-return-order', name: '進貨退還單' }],
  },
  {
    path: '/app/transfer-order',
    name: '調撥單',
  },
  {
    path: '/app/loan-order',
    name: '借出單',
    submenu: [
      {
        path: '/app/loan-return-order',
        name: '借出歸還單',
      },
    ],
  },
  {
    path: '/app/maintenance-order',
    name: '維修單',
    submenu: [
      {
        path: '/app/maintenance-return-order',
        name: '維修歸還單',
      },
    ],
  },
  {
    path: '/app/shipment-order',
    name: '出貨單',
    submenu: [
      {
        path: '/app/shipment-return-order',
        name: '退貨單',
      },
    ],
  },

  {
    groupName: '周邊/器材',
  },

  {
    groupName: '通用資訊'
  },
  {
    path: '',
    name: '藝術家',
  },
  {
    path: '',
    name: '藏家',
  },
  {
    path: '',
    name: '廠商',
  },

  // {
  //   path: '/app/dashboard',
  //   icon: <Squares2X2Icon className={iconClasses} />,
  //   name: 'Dashboard',
  // },
  // {
  //   path: '/app/leads', // url
  //   icon: <InboxArrowDownIcon className={iconClasses} />, // icon component
  //   name: 'Leads', // name that appear in Sidebar
  // },
  // {
  //   path: '/app/charts', // url
  //   icon: <ChartBarIcon className={iconClasses} />, // icon component
  //   name: 'Charts', // name that appear in Sidebar
  // },
  // {
  //   path: '/app/integration', // url
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
  //       path: '/app/blank',
  //       icon: <DocumentIcon className={submenuIconClasses} />,
  //       name: 'Blank Page',
  //     },
  //     {
  //       path: '/app/404',
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
  //       path: '/app/settings-profile', //url
  //       icon: <UserIcon className={submenuIconClasses} />, // icon component
  //       name: 'Profile', // name that appear in Sidebar
  //     },
  //     {
  //       path: '/app/settings-billing',
  //       icon: <WalletIcon className={submenuIconClasses} />,
  //       name: 'Billing',
  //     },
  //     {
  //       path: '/app/settings-team', // url
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
  //       path: '/app/getting-started', // url
  //       icon: <DocumentTextIcon className={submenuIconClasses} />, // icon component
  //       name: 'Getting Started', // name that appear in Sidebar
  //     },
  //     {
  //       path: '/app/features',
  //       icon: <TableCellsIcon className={submenuIconClasses} />,
  //       name: 'Features',
  //     },
  //     {
  //       path: '/app/components',
  //       icon: <CodeBracketSquareIcon className={submenuIconClasses} />,
  //       name: 'Components',
  //     },
  //   ],
  // },
];

export default routes;
