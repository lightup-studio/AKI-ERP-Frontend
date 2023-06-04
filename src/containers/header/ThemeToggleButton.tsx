import React, { useEffect } from 'react';

import {
  setCurrentTheme,
  setInitialTheme,
} from 'features/settings/settingsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'src/app/store';

import { MoonIcon, SunIcon } from '@heroicons/react/20/solid';

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

  const toggleTheme = () => {
    dispatch(setCurrentTheme(currentTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <label className="swap" onClick={toggleTheme}>
      <input type="checkbox" />
      <SunIcon
        data-set-theme="light"
        data-act-class="ACTIVECLASS"
        className={
          'fill-current w-6 h-6 ' +
          (currentTheme === 'dark' ? 'swap-on' : 'swap-off')
        }
      />
      <MoonIcon
        data-set-theme="dark"
        data-act-class="ACTIVECLASS"
        className={
          'fill-current w-6 h-6 ' +
          (currentTheme === 'light' ? 'swap-on' : 'swap-off')
        }
      />
    </label>
  );
}

export default ThemeToggleButton;
