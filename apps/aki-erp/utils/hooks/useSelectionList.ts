import { useMemo, useState } from 'react';

import { Row } from '@tanstack/react-table';

const useSelectionList = <T extends { id: string | number }>() => {
  const [rowSelection, setRowSelection] = useState<Record<string, T>>({});

  const selectedRows = useMemo(() => Object.values(rowSelection), [rowSelection]);
  const selectedRowCount = useMemo(() => Object.keys(rowSelection).length, [rowSelection]);

  const handleAllRowSelectionChange = (rows: Row<T>[]) => {
    const selectedRows = rows.filter((row) => row.original.id in rowSelection);
    const isAnyRowSelected = selectedRows.length > 0;

    if (isAnyRowSelected) {
      selectedRows.forEach((row) => delete rowSelection[row.original.id]);
    } else {
      rows.forEach((row) => (rowSelection[row.original.id] = row.original));
    }

    setRowSelection(structuredClone(rowSelection));
  };

  const handleRowSelectionChange = (row: Row<T>) => {
    const { id } = row.original;

    if (id in rowSelection) {
      delete rowSelection[id];
    } else {
      rowSelection[id] = row.original;
    }

    setRowSelection(structuredClone(rowSelection));
  };

  return {
    selectedRows,
    selectedRowCount,
    getSelectAllProps: (rows: Row<T>[], totalCount: number) => {
      return {
        checked: totalCount !== 0 && selectedRowCount === totalCount,
        indeterminate: selectedRowCount > 0,
        onChange: () => handleAllRowSelectionChange(rows),
      };
    },
    getSelectItemProps: (row: Row<T>) => {
      return {
        checked: row.original.id in rowSelection,
        indeterminate: false,
        onChange: () => handleRowSelectionChange(row),
      };
    },
    clearSelection: () => setRowSelection({}),
  };
};

export default useSelectionList;
