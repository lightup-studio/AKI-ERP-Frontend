import { useEffect, useState } from 'react';

import { Option as ComboboxOption } from '@components/shared/MyCombobox';
import { fetchArtworkList, patchArtwork } from '@data-access/apis/artworks.api';
import { ArtworkDetail, Status } from '@data-access/models';
import { useMutation, useQuery } from '@tanstack/react-query';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import { cloneDeep } from 'lodash-es';
import { useSearchParams } from 'next/navigation';
import { SelectItem } from './useArtworkSearches';
import useMe from './useMe';
import usePermission, { Action } from './usePermission';
import useSelectionList from './useSelectionList';
import useTable from './useTable';

// Give our default column cell renderer editing superpowers!
const inputColumn = ({
  getValue,
  row: { index },
  column: { id },
  table,
}: CellContext<ArtworkDetail, any>) => {
  const initialValue = getValue();
  // We need to keep and update the state of the cell normally
  const [value, setValue] = useState(initialValue);

  const onBlur = () => {
    (table.options.meta as any)?.updateColumnData(index, id, value);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <input
      className="input w-full px-1"
      value={value as string}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
    />
  );
};

// Give our default column cell renderer editing superpowers!
const selectColumn = (
  { getValue, row: { index }, column: { id }, table }: CellContext<ArtworkDetail, any>,
  options: ComboboxOption[],
  config?: { getValue?: () => any; onChange?: (value: string) => void },
) => {
  const initialValue = config?.getValue?.() ?? getValue();
  // We need to keep and update the state of the cell normally
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <select
      className="input w-[3rem] appearance-none p-0 text-center text-sm"
      value={value as string}
      onChange={(e) => {
        setValue(e.target.value);
        if (config?.onChange) {
          config?.onChange?.(e.target.value);
        } else {
          (table.options.meta as any)?.updateColumnData(index, id, value);
        }
      }}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

const useArtworksTable = ({
  status,
  columns,
  selectItems,
}: {
  status: Status;
  columns: ColumnDef<ArtworkDetail, any>[];
  selectItems?: SelectItem[];
  getSelectAllProps?: ReturnType<typeof useSelectionList>['getSelectAllProps'];
  getSelectItemProps?: ReturnType<typeof useSelectionList>['getSelectItemProps'];
}) => {
  const { hasPermission } = usePermission();

  const [assetsTypes, setAssetsTypes] = useState<string[]>(['無']);

  const { data } = useMe();
  const searchParams = useSearchParams();

  const params = new URLSearchParams(searchParams);

  const dataQuery = useQuery({
    queryKey: ['artworks', status, assetsTypes.toString(), params.toString()],
    queryFn: () => fetchArtworkList(status, assetsTypes, params),
    enabled: !!selectItems,
    keepPreviousData: true,
  });

  const [tableData, setTableData] = useState<ArtworkDetail[]>([]);

  useEffect(() => {
    if (hasPermission([Action.READ_ASSETSTYPE_A])) setAssetsTypes((prev) => [...prev, 'A']);
    if (hasPermission([Action.READ_ASSETSTYPE_B])) setAssetsTypes((prev) => [...prev, 'B']);
    if (hasPermission([Action.READ_ASSETSTYPE_C])) setAssetsTypes((prev) => [...prev, 'C']);
  }, [data?.name]);

  useEffect(() => {
    if (dataQuery.isSuccess) {
      const tableData = cloneDeep(dataQuery.data.data);
      setTableData(tableData);
    }
  }, [dataQuery.isSuccess, dataQuery.data]);

  const columnMutation = useMutation({
    mutationKey: ['updateArtwork'],
    mutationFn: ({ id, data }: { id: number; data: Partial<ArtworkDetail> }) =>
      patchArtwork(id, data),
    onError: () => {
      dataQuery.refetch();
    },
  });

  const { table, tableBlock, ...props } = useTable<ArtworkDetail>({
    data: tableData,
    columns: columns,
    isLoading: dataQuery.isFetching,
    totalCount: dataQuery.data?.totalCount,
    meta: {
      updateColumnData: function <TColumnId extends keyof ArtworkDetail>(
        rowIndex: number,
        columnId: TColumnId,
        value: ArtworkDetail[TColumnId],
      ) {
        const currentRow = table.getRowModel().rows[rowIndex];
        const id = currentRow.original.id;

        setTableData((tableData) =>
          tableData.map((row) => {
            if (row.id === id) {
              return {
                ...row,
                [columnId]: value,
              } as ArtworkDetail;
            }
            return row;
          }),
        );

        columnMutation.mutate({
          id,
          data: {
            [columnId]: value,
          },
        });
      },
    },
  });

  return {
    ...props,
    dataQuery,
    table,
    tableBlock,
  };
};

export { inputColumn, selectColumn };

export default useArtworksTable;
