import React, { useEffect } from 'react';

import { useCombinedRefs } from '@utils/hooks';

const IndeterminateCheckbox = React.forwardRef<
  HTMLInputElement,
  { indeterminate: boolean; className?: string }
>(({ indeterminate, className, ...rest }, ref: React.Ref<HTMLInputElement>) => {
  const defaultRef = React.useRef(null);
  const combinedRef = useCombinedRefs(ref, defaultRef);

  useEffect(() => {
    if (combinedRef?.current) {
      combinedRef.current.indeterminate = indeterminate ?? false;
    }
  }, [combinedRef, indeterminate]);

  return (
    <input
      type="checkbox"
      className={`checkbox !animate-none ${className ?? ''}`}
      ref={combinedRef}
      {...rest}
    />
  );
});

export default IndeterminateCheckbox;
