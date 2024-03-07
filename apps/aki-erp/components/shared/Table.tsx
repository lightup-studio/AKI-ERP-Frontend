import { Table, flexRender } from '@tanstack/react-table';
import cx from 'classnames';
import React from 'react';
import Skeleton from './Skeleton';

interface TableProps<T = any> {
  table: Table<T>;
  isLoading?: boolean;
}

const AkiTable: React.FC<TableProps> = ({ table, isLoading }) => {
  return (
    <section className="w-full overflow-x-auto">
      <table className="table w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="text-sm">
              {headerGroup.headers.map((header) => {
                return (
                  <td
                    key={header.id}
                    colSpan={header.colSpan}
                    className={cx('p-2', {
                      'min-w-[10rem]': !['select', 'storeType', 'salesType', 'assetsType'].includes(
                        header.id,
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
          {isLoading &&
            [0, 1, 2, 3, 4].map((index) => (
              <tr key={index} className="text-sm">
                {table.getHeaderGroups()[0].headers.map((header) => (
                  <td key={header.id} className="p-2">
                    <Skeleton />
                  </td>
                ))}
              </tr>
            ))}

          {!isLoading && table.getRowModel().rows.length === 0 ? (
            <tr>
              <td colSpan={table.getHeaderGroups()[0].headers.length}>
                <div className="flex min-h-[3rem] items-center justify-center">No Data.</div>
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => {
              return (
                <tr key={row.id} className="text-sm">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </section>
  );
};

export default AkiTable;
