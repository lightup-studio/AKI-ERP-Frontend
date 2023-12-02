import { useLayoutEffect, useMemo, useRef, useState } from 'react';

import cx from 'classnames';

import { getRefElement, px, RefOrElementOrCallback } from '../utils';
import { usePanMove } from './usePanMove';
import { useResultRef } from './useResultRef';

export type DragResizeState = {
  show: boolean;
  width: number;
};
type UseResizeAndToggleOptions = {
  /**
   * direction to increase size
   *
   * @default 'right'
   */
  direction?: 'left' | 'right';
  getCacheStateAndAction: () => [DragResizeState, (value: DragResizeState) => void];
};

/**
 * group resize and toggle logic together,
 * let you can control resize and toggle easily.
 */
export const useResizeAndToggle = (
  target: RefOrElementOrCallback | EventTarget,
  { getCacheStateAndAction, direction = 'right' }: UseResizeAndToggleOptions,
) => {
  const { current: cacheStateAndAction } = useResultRef(() => getCacheStateAndAction());
  const [cacheState, setCacheState] = cacheStateAndAction;

  const [show, setShow] = useState(cacheState.show);
  const widthRef = useRef(cacheState.width);
  const dragAnchorRef = useRef<HTMLDivElement>(null);

  usePanMove(dragAnchorRef, {
    onMove: (delta) => {
      const targetElm = getRefElement(target as HTMLElement)!;

      if (!targetElm) return;

      // set width directly, make performance better
      targetElm.style.width = px(widthRef.current + (direction === 'right' ? delta : -delta));
    },
    onMoveEnd: () => {
      const targetElm = getRefElement(target as HTMLElement)!;
      if (!targetElm) return;

      // only trigger cache when move end and release change
      widthRef.current = targetElm.clientWidth;
      setCacheState({ show, width: widthRef.current });
    },
  });

  useLayoutEffect(() => {
    const targetElm = getRefElement(target as HTMLElement)!;
    if (!targetElm) return;

    targetElm.style.width = px(widthRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    show,
    setShow: (show: boolean) => {
      setShow(show);
      setCacheState({ show, width: widthRef.current });
    },
    dragNode: useMemo(
      () => (
        <div
          ref={dragAnchorRef}
          className={cx(
            'w-[10px] absolute select-none h-full top-0 z-[1] cursor-col-resize',
            direction === 'right' ? 'right-0 translate-x-[50%]' : 'left-0 -translate-x-[50%]',
          )}
        />
      ),
      [direction],
    ),
  };
};
