import { useState } from 'react';
import { createSearchParams, SetURLSearchParams } from 'react-router-dom';

export const useMemorySearchParams = () =>
{
  const [params, setParams] = useState(createSearchParams());
  const setMemorySearchParams: SetURLSearchParams = (nextInit, navigateOpts) =>
  {
    if (typeof nextInit === 'function') {
      nextInit = nextInit(params);
    }
    setParams(createSearchParams(nextInit));
  };
  return [params, setMemorySearchParams] as const;
};