import {
  Fragment,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Combobox,
  Transition,
} from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';

export interface Option {
  label: string;
  value: string;
}

interface MyComboboxProps {
  testId?: string;
  placeholder?: string;
  options?: Option[];
  value?: string;
  autoClearQuery?: boolean;
  onSelectionChange?: (option: Option) => void;
  disabled?: boolean;
}

const MyCombobox = memo(
  ({
    testId,
    options = [],
    placeholder,
    value = '',
    autoClearQuery = true,
    onSelectionChange,
    disabled = false,
  }: MyComboboxProps) => {
    const [query, setQuery] = useState(value);
    const comboboxButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
      setQuery(value);
    }, [value]);

    const handleInputFocus = useCallback(() => {
      comboboxButtonRef.current?.click();
    }, []);

    const handleOptionSelect = useCallback(
      (option: Option) => {
        onSelectionChange?.(option);
      },
      [onSelectionChange],
    );

    const filteredOptions = options.filter((option) =>
      option.label.toLowerCase().includes(query.toLowerCase()),
    );

    return (
      <Combobox onChange={handleOptionSelect} disabled={disabled}>
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              data-testid={testId}
              className="input input-bordered w-full py-2 pl-3 pr-10 text-sm leading-5 focus:ring-0"
              placeholder={query.length > 0 ? query : placeholder}
              onChange={(event) => setQuery(event.target.value)}
              onClick={handleInputFocus}
              value={query}
            />
            <Combobox.Button
              className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
              ref={comboboxButtonRef}
            >
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            {...(autoClearQuery ? { afterLeave: () => setQuery('') } : {})}
          >
            <Combobox.Options className="bg-base-100 absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
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
                  >
                    {({ selected, active }) => (
                      <>
                        <div
                          className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}
                        >
                          {option.label}
                        </div>
                        {selected ? (
                          <div
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? 'text-white' : 'text-teal-600'
                            }`}
                          ></div>
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
  },
);

export default MyCombobox;
