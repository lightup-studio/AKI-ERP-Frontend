import React, { useEffect } from 'react';

import {
  setCurrentTheme,
  setInitialTheme,
} from 'features/settings/settingsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'src/app/store';

import { MoonIcon, SunIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';

function ThemeToggleButton() {
  const dispatch = useDispatch<AppDispatch>();
  const { currentTheme } = useSelector((state: RootState) => state.settings);

  useEffect(() => {
    dispatch(setInitialTheme());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = currentTheme;
  }, [currentTheme]);

  return (
    <label className="swap">
      <input type="checkbox" />
      <SunIcon
        data-set-theme="light"
        data-act-class="ACTIVECLASS"
        className={classNames('fill-current w-6 h-6', {
          hidden: currentTheme !== 'light',
        })}
        onClick={() => dispatch(setCurrentTheme('dark'))}
      />
      <MoonIcon
        data-set-theme="dark"
        data-act-class="ACTIVECLASS"
        className={classNames('fill-current w-6 h-6', {
          hidden: currentTheme !== 'dark',
        })}
        onClick={() => dispatch(setCurrentTheme('light'))}
      />
    </label>
  );
}

export default ThemeToggleButton;
