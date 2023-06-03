import { useEffect, useState } from 'react';

import { themeChange } from 'theme-change';

export type ThemeType = 'dark' | 'light';

function useTheme() {
  const [currentTheme, setCurrentTheme] = useState(
    localStorage.getItem('theme') as ThemeType
  );

  useEffect(() => {
    themeChange(false);
    if (currentTheme === null) {
      if (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      ) {
        setCurrentTheme('dark');
      } else {
        setCurrentTheme('light');
      }
    }
  }, [currentTheme]);

  return currentTheme;
}

export default useTheme;
