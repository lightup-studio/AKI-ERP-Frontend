import { useState, useRef, useCallback, Fragment } from 'react';
import { Combobox, Transition } from '@headlessui/react';

import React from 'react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

export interface Option {
  label: string;
  value: string;
}

interface MyComboboxProps {
  placeholder?: string;
  options?: Option[];
  onSelectionChange?: (option: Option) => void;
}

export default function MyCombobox({
  options = [],
  placeholder,
  onSelectionChange,
}: MyComboboxProps) {
  const [query, setQuery] = useState('');
  const comboboxButtonRef = useRef<HTMLButtonElement>(null);

  const handleInputFocus = useCallback(() => {
    comboboxButtonRef.current?.click();
  }, []);

  const handleOptionSelect = useCallback(
    (option: Option) => {
      onSelectionChange?.(option);
    },
    [onSelectionChange]
  );

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Combobox>
      <div className="relative mt-1">
        <div className="relative w-full cursor-default overflow-hidden rounded-lg text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
          <Combobox.Input
            className="input input-bordered w-full py-2 pl-3 pr-10 text-sm leading-5 focus:ring-0"
            placeholder={placeholder}
            onChange={(event) => setQuery(event.target.value)}
            onClick={handleInputFocus}
          />
          <Combobox.Button
            className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
            ref={comboboxButtonRef}
          >
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Combobox.Button>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery('')}
        >
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-base-100 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredOptions.length === 0 && query !== '' ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                Nothing found.
              </div>
            ) : (
              filteredOptions.map((option) => (
                <Combobox.Option
                  key={option.value}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 px-4 ${
                      active ? 'bg-teal-600 text-white' : 'text-base-content'
                    }`
                  }
                  value={option}
                  onClick={() => handleOptionSelect(option)}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {option.label}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? 'text-white' : 'text-teal-600'
                          }`}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
}
