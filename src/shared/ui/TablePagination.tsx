import classnames from 'classnames';
import { DOTS, usePagination } from 'shared/hooks/usePagination';
import { Table } from '@tanstack/react-table';

function TablePagination<T>({
  table,
  pageIndex,
  pageSize,
  totalCount,
}: {
  table: Table<T>;
  pageIndex: number;
  pageSize: number;
  totalCount: number;
}) {
  const paginationRange = usePagination({
    currentPage: pageIndex,
    totalCount,
    siblingCount: 1,
    pageSize: pageSize,
  });

  return (
    <div className="join">
      <button className="join-item btn" onClick={() => table.setPageIndex(pageIndex - 5)} disabled={!table.getCanPreviousPage()}>
        {'<<'}
      </button>
      <button className="join-item btn" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
        {'<'}
      </button>

      <button className="join-item btn btn-active block md:hidden">第 {pageIndex + 1} 頁</button>

      {paginationRange?.map((pageNumber, key) => {
        if (pageNumber === DOTS) {
          return (
            <button key={key} className="join-item btn btn-disabled hidden md:block">
              {DOTS}
            </button>
          );
        }

        return (
          <button
            key={key}
            className={classnames('join-item btn w-14 hidden md:block', {
              'btn-active': Number(pageNumber) - 1 === pageIndex,
            })}
            onClick={() => table.setPageIndex(Number(pageNumber) - 1)}
          >
            {pageNumber}
          </button>
        );
      })}

      <button className="join-item btn" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
        {'>'}
      </button>
      <button className="join-item btn" onClick={() => table.setPageIndex(pageIndex + 5)} disabled={!table.getCanNextPage()}>
        {'>>'}
      </button>
    </div>
  );
}

export default TablePagination;
