'use client';

import { ChevronUpDownIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';
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
        className={classNames({
          'border border-error rounded-lg': errorMsg,
        })}
      >
        <Group className="input input-bordered pr-0 flex rounded-lg focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[hsl(var(--bc)_/_1)] [&:has([data-pressed])]:border-white transition pl-3 text-left focus:outline-none ">
          <DateInput className="flex items-center py-2 flex-1">
            {(segment) => (
              <DateSegment
                segment={segment}
                className="px-0.5 box-content tabular-nums text-right outline-none rounded-sm focus:bg-base-content focus:text-base-100 group caret-transparent data-[placeholder]:italic"
              />
            )}
          </DateInput>
          <Button className="cursor-default outline-none px-2 transition border-l border-l-base-200 rounded-r-lg data-[pressed]:bg-base-content/10 data-[focus-visible]:bg-base-content/10">
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
          px-4 sm:px-0 rounded-lg drop-shadow-lg ring-1 ring-black/10 bg-base-100 ${
            props.className || ''
          }
          ${
            isEntering
              ? 'animate-in fade-in data-[placement=bottom]:slide-in-from-top-1 data-[placement=top]:slide-in-from-bottom-1 ease-out duration-200 fill-mode-forwards'
              : ''
          }
          ${
            isExiting
              ? 'animate-out fade-out data-[placement=bottom]:slide-out-to-top-1 data-[placement=top]:slide-out-to-bottom-1 ease-in duration-150 fill-mode-forwards'
              : ''
          }
        `}
    />
  );
};

export default DatePickerField;
