import { useEffect, useState } from 'react';

import MyCombobox, { Option as ComboboxOption } from '@components/shared/MyCombobox';
import { fetchSelectOptions } from '@data-access/apis/artworks.api';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { useQuery } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export type SelectItemKey = keyof Awaited<ReturnType<typeof fetchSelectOptions>>;

export type SelectItem = {
  key: SelectItemKey;
  placeholder: string;
  options: ComboboxOption[];
};

export type SelectedOption = ComboboxOption & {
  selectItemKey: SelectItemKey;
};

const SELECT_ITEMS: Pick<SelectItem, 'key' | 'placeholder'>[] = [
  { key: 'nationalities', placeholder: '國籍' },
  { key: 'artists', placeholder: '藝術家' },
  { key: 'serialNumbers', placeholder: '號數' },
  { key: 'years', placeholder: '年代' },
  { key: 'storeTypes', placeholder: '庫存狀態' },
  { key: 'salesTypes', placeholder: '銷售狀態' },
  { key: 'assetsTypes', placeholder: '資產類別' },
  { key: 'mediums', placeholder: '媒材' },
  { key: 'agentGalleries', placeholder: '藝廊資訊' },
  { key: 'otherInfos', placeholder: '其他資訊' },
];

export const useArtworkSearches = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const params = new URLSearchParams(searchParams);

  const [keyword, setKeyword] = useState(searchParams.get('keyword'));
  const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>([]);

  useEffect(() => {
    if ((keyword || '').trim() === (searchParams.get('keyword') || '').trim()) return;

    keyword ? params.set('keyword', keyword) : params.delete('keyword');
    params.delete('pageIndex');

    router.push(`${pathname}?${params.toString()}`);
  }, [keyword]);

  const handleSearch = (keyword?: string | null) => {
    setKeyword(keyword || '');
  };

  const selectOptionsQuery = useQuery({
    queryKey: ['selectOptions'],
    queryFn: fetchSelectOptions,
  });

  const [selectItems, setSelectItems] = useState<SelectItem[]>();

  useEffect(() => {
    if (selectOptionsQuery.isSuccess) {
      const selectItems = SELECT_ITEMS.filter(({ key }) => key in selectOptionsQuery.data).map(
        (item) =>
          ({
            ...item,
            options: selectOptionsQuery.data[item.key],
          } as SelectItem)
      );
      setSelectItems(selectItems);
    }
  }, [selectOptionsQuery.isSuccess, selectOptionsQuery.data]);

  useEffect(() => {
    if (!selectOptionsQuery.data) return;

    const selectedOptions = ([...searchParams.entries()] as [SelectItemKey, string][])
      .filter(([key]) => key in selectOptionsQuery.data)
      .map<SelectedOption>(([key, value]) => ({
        selectItemKey: key,
        label: selectOptionsQuery.data[key].find((x: any) => x.value === value)?.label || '',
        value,
      }));

    const selectedOptionMapByKey = selectedOptions.reduce((obj, item) => {
      if (item.selectItemKey in obj) {
        obj[item.selectItemKey].push(item);
      } else {
        obj[item.selectItemKey] = [item];
      }
      return obj;
    }, {} as Record<SelectItemKey, SelectedOption[]>);

    setSelectItems((selectItems) => {
      selectItems?.forEach((selectItem) => {
        const selectedOptionValues = selectedOptionMapByKey[selectItem.key]?.map(
          (option) => option.value
        );

        selectItem.options = selectOptionsQuery.data[selectItem.key].filter(
          (option: any) => !selectedOptionValues?.includes(option.value)
        );
      });
      return [...(selectItems || [])];
    });

    setSelectedOptions(
      SELECT_ITEMS?.filter((item) => item.key in selectedOptionMapByKey).flatMap(
        (item) => selectedOptionMapByKey[item.key]
      ) || []
    );
  }, [searchParams, selectOptionsQuery.data]);

  const addSelectedOptionBySelectItemKey = ({
    selectItemKey,
    selectedOptionValue,
  }: OnSelectionChangeValue) => {
    params.append(selectItemKey, selectedOptionValue);
    params.delete('pageIndex');
    router.push(`${pathname}?${params.toString()}`);
  };

  const removeSelectedOptionBySelectItemKey = ({ selectItemKey }: OnSelectionChangeValue) => {
    params.delete(selectItemKey);
    params.delete('pageIndex');
    router.push(`${pathname}?${params.toString()}`);
  };

  type OnSelectionChangeValue = {
    selectItemKey: SelectItemKey;
    selectedOptionValue: string;
  };

  return {
    searchParams,
    selectItems,
    onSelectionChange: (type: 'add' | 'remove', value: OnSelectionChangeValue) => {
      switch (type) {
        case 'add':
          addSelectedOptionBySelectItemKey(value);
          break;
        case 'remove':
          removeSelectedOptionBySelectItemKey(value);
          break;
        default:
          throw new Error('Invalid type');
      }
    },
    selectedOptions,
    getSearchInputProps: () => ({
      value: keyword,
      onSearch: handleSearch,
    }),
  };
};

export const useArtworkSelectedList = ({
  selectItems,
  selectedOptions,
  onSelectionChange,
}: Pick<
  ReturnType<typeof useArtworkSearches>,
  'selectItems' | 'selectedOptions' | 'onSelectionChange'
>) => {
  const addSelectedOptionBySelectItemKey = (
    selectItemKey: SelectItemKey,
    selectedOptionValue: string
  ) => {
    onSelectionChange('add', {
      selectItemKey,
      selectedOptionValue,
    });
  };

  const removeSelectedOptionBySelectItemKey = (
    selectItemKey: SelectItemKey,
    selectedOptionValue: string
  ) => {
    onSelectionChange('remove', {
      selectItemKey,
      selectedOptionValue,
    });
  };

  return {
    selectionBlock: (
      <div className="flex items-center flex-col md:flex-row min-h-[6rem]">
        <label className="text-lg break-keep">篩選條件：</label>
        <div className="flex-grow flex flex-wrap gap-2">
          {selectItems?.map((item) => (
            <MyCombobox
              key={item.key}
              placeholder={item.placeholder}
              options={item.options}
              onSelectionChange={(option) =>
                addSelectedOptionBySelectItemKey(item.key, option.value)
              }
            ></MyCombobox>
          ))}
        </div>
      </div>
    ),
    selectedBlock: (
      <div className="flex items-center flex-col md:flex-row min-h-12">
        <label className="text-lg break-keep">已選條件：</label>
        <div className="flex-grow flex flex-wrap gap-2">
          {selectedOptions.map((option, i) => (
            <button
              key={`selectedOption_${i}`}
              type="button"
              className="btn btn-outline btn-info pr-0 min-w-[6rem] justify-between"
              onClick={() =>
                removeSelectedOptionBySelectItemKey(option.selectItemKey, option.value)
              }
            >
              {option.label}
              <XMarkIcon className="w-5 h-5 mx-2" id={i.toString()} />
            </button>
          ))}
        </div>
      </div>
    ),
  };
};
