import { Table } from '@tanstack/react-table';
import usePagination, { DOTS } from '@utils/hooks/usePagination';
import cx from 'classnames';

function TablePagination<T>({
  table,
  pageSize,
  pageIndex,
  totalCount = 0,
}: {
  table: Table<T>;
  pageSize: number;
  pageIndex: number;
  totalCount: number;
}) {
  const paginationRange = usePagination({
    currentPage: pageIndex,
    pageSize,
    totalCount,
    siblingCount: 1,
  });

  return (
    <div className="join">
      <button
        className="join-item btn"
        onClick={() => table.setPageIndex(pageIndex - 5)}
        disabled={!table.getCanPreviousPage()}
      >
        {'<<'}
      </button>
      <button
        className="join-item btn"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
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
            className={cx('join-item btn hidden w-14 md:block', {
              'btn-active': Number(pageNumber) - 1 === pageIndex,
            })}
            onClick={() => table.setPageIndex(Number(pageNumber) - 1)}
          >
            {pageNumber}
          </button>
        );
      })}

      <button
        className="join-item btn"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        {'>'}
      </button>
      <button
        className="join-item btn"
        onClick={() => table.setPageIndex(pageIndex + 5)}
        disabled={!table.getCanNextPage()}
      >
        {'>>'}
      </button>
    </div>
  );
}

export default TablePagination;
