/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';

import { deleteArtworks } from 'data-access/apis/artworks.api';
import { setPageTitle } from 'features/common/headerSlice';
import { useDispatch } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import SearchInput from 'shared/ui/SearchInput';

import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import TrashIcon from '@heroicons/react/24/solid/TrashIcon';
import { useMutation } from '@tanstack/react-query';

import ArtworksTitle, { ArtworksTitleProps } from './ui/ArtworksTitle';
import { useArtworkSearches, useArtworkSelectedList } from './useArtworkSearches';
import { useArtworkTable } from './useArtworkTable';

type ArtworksListProps = Pick<ArtworksTitleProps, 'type'>;

function ArtworksList({ type }: ArtworksListProps) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: <ArtworksTitle type={type} /> }));
  }, [dispatch, type]);

  const [searchParams, setSearchParams] = useSearchParams();

  const { getSearchInputProps, selectItems, selectedOptions, onSelectionChange } = useArtworkSearches({
    searchParams,
    setSearchParams,
  });

  const { selectionBlock, selectedBlock } = useArtworkSelectedList({
    selectItems,
    selectedOptions,
    onSelectionChange,
  });

  const { dataQuery, table, selectedRowCount, handleDelete, tableBlock } = useArtworkTable({
    selectItems,
    searchParams,
    setSearchParams,
  });

  const deleteMutation = useMutation({
    mutationKey: ['deleteArtworks'],
    mutationFn: deleteArtworks,
    onSuccess: () => {
      dataQuery.refetch();
    },
  });

  const onDelete = () => {
    const result = handleDelete();
    if (!result) return;
    deleteMutation.mutate(result.keys);
  };

  return (
    <div className="card w-full p-6 bg-base-100 shadow-xl">
      <div className="md:w-1/2 mb-3">
        <SearchInput {...getSearchInputProps()} />
      </div>

      <div className="flex gap-2 flex-col md:flex-row">
        <div className="flex-grow flex flex-col gap-3">
          {selectionBlock}
          {selectedBlock}
        </div>
        <div className="flex flex-col gap-2 justify-between">
          <div className="flex md:flex-col gap-2">
            <button aria-label="export excel file" className="btn btn-accent flex-1 truncate">
              Excel 匯出
            </button>
            <button aria-label="export pdf file" className="btn btn-accent flex-1">
              表格匯出
            </button>
          </div>
          <i className="flex-grow"></i>
          <select
            className="select select-bordered"
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[10, 30, 50, 80, 100].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize} 筆
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="divider mt-2 mb-0"></div>

      <div className="flex items-center gap-2 py-2 mb-2">
        <span>已選擇 {selectedRowCount} 筆</span>
        <button className="btn btn-error" onClick={onDelete} disabled={selectedRowCount === 0}>
          <TrashIcon className="h-5 w-5"></TrashIcon>
          刪除
        </button>
        <i className="flex-grow"></i>
        <Link className="btn btn-info" to={'./add' + (searchParams.toString() && '?' + searchParams.toString())}>
          <PlusIcon className="h-5 w-5"></PlusIcon>
          新增
        </Link>
      </div>

      {tableBlock}
    </div>
  );
}

export default ArtworksList;
