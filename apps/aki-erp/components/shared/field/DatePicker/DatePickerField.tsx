'use client';

import { ChevronUpDownIcon } from '@heroicons/react/20/solid';
import cx from 'classnames';
import React from 'react';
import {
  Button,
  DateInput,
  DatePicker,
  DatePickerProps,
  DateSegment,
  DateValue,
  Dialog,
  Group,
  Popover,
  PopoverProps,
} from 'react-aria-components';
import { ControllerRenderProps } from 'react-hook-form';
import { AnimatedCalendar } from './AnimatedCalendar';

type DatePickerFieldProps = ControllerRenderProps &
  Omit<DatePickerProps<DateValue>, 'value' | 'onBlur' | 'onChange'> & {
    disabled?: boolean;
    errorMsg?: string;
  };

const DatePickerField = React.forwardRef<HTMLDivElement, DatePickerFieldProps>(
  function DatePickerField(props, ref) {
    const { name, value, disabled, errorMsg } = props;
    return (
      <DatePicker
        {...props}
        ref={ref}
        value={value || null}
        aria-label={name}
        isDisabled={disabled}
        className={cx({
          'border-error rounded-lg border': errorMsg,
        })}
      >
        <Group className="input input-bordered flex rounded-lg pr-0 pl-3 text-left transition focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[hsl(var(--bc)_/_1)] focus:outline-none [&:has([data-pressed])]:border-white ">
          <DateInput className="flex flex-1 items-center py-2">
            {(segment) => (
              <DateSegment
                segment={segment}
                className="focus:bg-base-content focus:text-base-100 group box-content rounded-sm px-0.5 text-right tabular-nums caret-transparent outline-none data-[placeholder]:italic"
              />
            )}
          </DateInput>
          <Button className="border-l-base-200 data-[pressed]:bg-base-content/10 data-[focus-visible]:bg-base-content/10 cursor-default rounded-r-lg border-l px-2 outline-none transition">
            <ChevronUpDownIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
          </Button>
        </Group>
        <DatePopover>
          <Dialog className="p-6 text-gray-600">
            <AnimatedCalendar />
          </Dialog>
        </DatePopover>
      </DatePicker>
    );
  },
);

const DatePopover = (props: PopoverProps & React.RefAttributes<HTMLElement>) => {
  return (
    <Popover
      {...props}
      className={({ isEntering, isExiting }) => `
          bg-base-100 rounded-lg px-4 ring-1 ring-black/10 drop-shadow-lg sm:px-0 ${
            props.className || ''
          }
          ${
            isEntering
              ? 'animate-in fade-in data-[placement=bottom]:slide-in-from-top-1 data-[placement=top]:slide-in-from-bottom-1 fill-mode-forwards duration-200 ease-out'
              : ''
          }
          ${
            isExiting
              ? 'animate-out fade-out data-[placement=bottom]:slide-out-to-top-1 data-[placement=top]:slide-out-to-bottom-1 fill-mode-forwards duration-150 ease-in'
              : ''
          }
        `}
    />
  );
};

export default DatePickerField;
