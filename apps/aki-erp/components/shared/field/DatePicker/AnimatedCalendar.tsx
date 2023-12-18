'use client';

import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';

import {
  animate,
  motion,
  useDragControls,
  useMotionValue,
  ValueAnimationTransition,
} from 'framer-motion';
import {
  Button,
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  Heading,
} from 'react-aria-components';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';

export function AnimatedCalendar() {
  // Store the number of pages we've navigated left or right from where we started.
  const [pageOffset, setPageOffset] = useState(0);

  return (
    <Calendar aria-label="Appointment date" className="w-fit pt-4">
      {(state) => (
        <>
          <header className="flex w-full items-center px-3 pb-4 font-serif sm:px-1">
            <Heading className="ml-2 flex-1 text-2xl font-semibold" />
            <Button
              slot="previous"
              onPress={() => {
                state.focusPreviousPage();
                setPageOffset(pageOffset - 1);
              }}
              className="ml-4 flex h-12 w-12 cursor-default items-center justify-center rounded-full outline-none data-[hovered]:bg-gray-100 data-[pressed]:bg-gray-200 data-[focus-visible]:ring data-[focus-visible]:ring-black data-[focus-visible]:ring-offset-2 sm:h-9 sm:w-9"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </Button>
            <Button
              slot="next"
              onPress={() => {
                state.focusNextPage();
                setPageOffset(pageOffset + 1);
              }}
              className="flex h-12 w-12 cursor-default items-center justify-center rounded-full outline-none data-[hovered]:bg-gray-100 data-[pressed]:bg-gray-200 data-[focus-visible]:ring data-[focus-visible]:ring-black data-[focus-visible]:ring-offset-2 sm:h-9 sm:w-9"
            >
              <ChevronRightIcon className="h-6 w-6" />
            </Button>
          </header>
          <Carousel
            pageOffset={pageOffset}
            onNext={() => {
              state.focusNextPage();
              setPageOffset(pageOffset + 1);
            }}
            onPrevious={() => {
              state.focusPreviousPage();
              setPageOffset(pageOffset - 1);
            }}
          >
            {(offset) => <Month offset={offset} />}
          </Carousel>
        </>
      )}
    </Calendar>
  );
}

function Month({ offset }: { offset: number }) {
  return (
    <CalendarGrid offset={{ months: offset }} className="border-separate border-spacing-1">
      <CalendarGridHeader>
        {(day) => <CalendarHeaderCell className="text-xs font-semibold">{day}</CalendarHeaderCell>}
      </CalendarGridHeader>
      <CalendarGridBody>
        {(date) => (
          <CalendarCell
            date={date}
            className="text-md data-[outside-month]:text-base-content/20 flex h-12 w-12 cursor-default items-center justify-center rounded-full outline-none data-[hovered]:bg-gray-100 data-[pressed]:bg-gray-200 data-[selected]:data-[hovered]:bg-black data-[selected]:bg-black data-[selected]:text-white data-[focus-visible]:ring data-[focus-visible]:ring-black data-[focus-visible]:ring-offset-2 sm:h-9 sm:w-9 sm:text-sm"
          />
        )}
      </CalendarGridBody>
    </CalendarGrid>
  );
}

interface CarouselProps {
  pageOffset: number;
  children: (offset: number) => ReactNode;
  onNext: () => void;
  onPrevious: () => void;
}

const inertiaTransition: ValueAnimationTransition = {
  type: 'inertia',
  bounceStiffness: 300,
  bounceDamping: 40,
  timeConstant: 300,
};

const staticTransition: ValueAnimationTransition = {
  duration: 0.5,
  ease: [0.32, 0.72, 0, 1],
};

function Carousel({ pageOffset, children, onNext, onPrevious }: CarouselProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  const animateToPage = useCallback(
    (index: number) => {
      // Animate to the new page. Use inertia if the velocity is not zero (e.g. when swiping),
      // otherwise use a static transition (e.g. when next/previous buttons are clicked).
      const pos = -index * ref.current!.clientWidth ?? 0;
      return animate(
        x,
        pos,
        x.getVelocity() !== 0
          ? {
              ...inertiaTransition,
              min: pos,
              max: pos,
            }
          : staticTransition,
      );
    },
    [x],
  );

  useEffect(() => {
    x.stop();
    const controls = animateToPage(pageOffset);
    return controls?.stop;
  }, [pageOffset, animateToPage, x]);

  const drag = useDragControls();

  return (
    <div ref={ref} className="relative touch-none overflow-hidden">
      <motion.div
        style={{ x }}
        drag="x"
        dragElastic={1}
        whileDrag={{
          // Disable hover styles on cells while dragging.
          pointerEvents: 'none',
        }}
        dragListener={false}
        dragControls={drag}
        onPointerDownCapture={(e: any) => {
          // Only start dragging on touch devices.
          if (e.pointerType === 'touch') {
            drag.start(e);
          }
        }}
        onDragStart={() => {
          // Cancel react-aria press event on date cell when dragging starts.
          document.dispatchEvent(new PointerEvent('pointercancel'));
        }}
        onDragEnd={(e: any, { offset, velocity }: any) => {
          // Change page if the user drags most of the way to the next page,
          // or the velocity is greater than some threshold. Otherwise,
          // animate back to the current page.
          const threshold = ref.current!.clientWidth * 0.6;
          if (offset.x > threshold || velocity.x > 10) {
            onPrevious();
          } else if (offset.x < -threshold || velocity.x < -10) {
            onNext();
          } else {
            animateToPage(pageOffset);
          }
        }}
      >
        {/* The current page is relative, and the others are absolute. This makes width: fit-content work. */}
        <Page index={pageOffset - 1} className="absolute" inert="true">
          {children(-1)}
        </Page>
        <Page index={pageOffset} className="relative">
          {children(0)}
        </Page>
        <Page index={pageOffset + 1} className="absolute" inert="true">
          {children(1)}
        </Page>
      </motion.div>
    </div>
  );
}

interface PageProps {
  index: number;
  children: ReactNode;
  className: string;
  inert?: string;
}

function Page({ index, children, className, ...otherProps }: PageProps) {
  return (
    <div className={`${className} top-0`} style={{ left: `${index * 100}%` }} {...otherProps}>
      {children}
    </div>
  );
}
