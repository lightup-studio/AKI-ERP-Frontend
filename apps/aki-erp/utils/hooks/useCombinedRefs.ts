import { useEffect, useRef } from 'react';

// TODO: suggest not write with that way, useRef can use sync method without useEffect
// Like https://github.com/michaldudak/material-ui/blob/08272d72b4e7cca8b30ce011f62796f125887ccc/packages/mui-utils/src/useForkRef/useForkRef.ts#L5
const useCombinedRefs = (...refs: any[]): React.MutableRefObject<any> => {
  const targetRef = useRef();

  useEffect(() => {
    refs.forEach((ref) => {
      if (!ref) return;

      if (typeof ref === 'function') {
        ref(targetRef.current);
      } else {
        ref.current = targetRef.current;
      }
    });
  }, [refs]);

  return targetRef;
};

export default useCombinedRefs;
