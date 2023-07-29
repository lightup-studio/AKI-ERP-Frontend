import { Table, flexRender } from '@tanstack/react-table';
import classNames from 'classnames';
import React from 'react';

interface TableProps<T = any> {
  table: Table<T>;
  isLoading?: boolean;
}

const Table: React.FC<TableProps> = ({ table, isLoading }) => {
  return (
    <section className="overflow-x-auto w-full">
      <table className="table w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="text-sm">
              {headerGroup.headers.map((header) => {
                return (
                  <td
                    key={header.id}
                    colSpan={header.colSpan}
                    className={classNames('p-2', {
                      'min-w-[10rem]': !['select', 'storeType', 'salesType', 'assetsType'].includes(
                        header.id
                      ),
                      'min-w-[3rem]': ['storeType', 'salesType', 'assetsType'].includes(header.id),
                      'text-center': ['assetsType'].includes(header.id),
                    })}
                  >
                    {header.isPlaceholder ? null : (
                      <div>{flexRender(header.column.columnDef.header, header.getContext())}</div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </thead>

        <tbody>
          {isLoading ? (
            <tr className="bg-base-200 text-base-content">
              <td colSpan={table.getHeaderGroups()[0].headers.length}>
                <div className="flex justify-center items-center min-h-[3rem]">
                  <span className="loading loading-bars loading-xs"></span>
                </div>
              </td>
            </tr>
          ) : table.getRowModel().rows.length === 0 ? (
            <tr className="bg-base-200 text-base-content">
              <td colSpan={table.getHeaderGroups()[0].headers.length}>
                <div className="flex justify-center items-center min-h-[3rem]">No Data.</div>
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => {
              return (
                <tr key={row.id} className="text-sm">
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td key={cell.id} className="p-2">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </section>
  );
};

export default Table;
