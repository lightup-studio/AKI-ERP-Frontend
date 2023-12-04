'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import Bars3Icon from '@heroicons/react/24/outline/Bars3Icon';
import BellIcon from '@heroicons/react/24/outline/BellIcon';
import UserCircleIcon from '@heroicons/react/24/outline/UserCircleIcon';
import PageTitle from '../PageTitle';

const Navbar = () => {
  const router = useRouter();

  const logoutUser = () => {
    localStorage.clear();
    router.push('/login');
  };

  return (
    <div className="navbar bg-base-100 z-10 flex justify-between shadow-md ">
      {/* Menu toggle for mobile view or small screen */}
      <div>
        <label htmlFor="left-sidebar-drawer" className="btn btn-primary drawer-button lg:hidden">
          <Bars3Icon className="inline-block h-5 w-5" />
        </label>
        <h1 className="ml-2 text-2xl font-semibold">
          <PageTitle />
        </h1>
      </div>

      <div className="order-last">
        {/* Multiple theme selection, uncomment this if you want to enable multiple themes selection,
        also includes corporate and retro themes in tailwind.config file */}

        {/* <select className="select select-sm mr-4" data-choose-theme>
          <option disabled selected>
            Theme
          </option>
          <option value="light">Default</option>
          <option value="dark">Dark</option>
          <option value="corporate">Corporate</option>
          <option value="retro">Retro</option>
        </select> */}
        {/* <ThemeToggleButton></ThemeToggleButton> */}
        {/* Notification icon */}
        <button className="btn btn-ghost btn-circle ml-4">
          <div className="indicator">
            <BellIcon className="h-6 w-6" />
            {/* {noOfNotifications > 0 ? (
              <span className="indicator-item badge badge-secondary badge-sm">
                {noOfNotifications}
              </span>
            ) : null} */}
          </div>
        </button>
        {/* Profile icon, opening menu on click */}
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <UserCircleIcon />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow"
          >
            <li className="justify-between">
              <Link href="/profile">
                Profile
                <span className="badge">New</span>
              </Link>
            </li>
            <div className="divider mt-0 mb-0"></div>
            <li>
              <div className="w-full" onClick={logoutUser}>
                Logout
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
