'use client';

import { useEffect, useMemo, useState } from 'react';

import { ArtworksSelector } from '@components/artworks';
import { IndeterminateCheckbox } from '@components/shared/field';
import {
  assetsTypeOptionMap,
  salesTypeOptionMap,
  storeTypeOptionMap,
} from '@constants/artwork.constant';
import { createTransferOrder, fetchTransferOrderId } from '@data-access/apis';
import {
  CheckIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid';
import { yupResolver } from '@hookform/resolvers/yup';
import { parseDate } from '@internationalized/date';
import { useMutation, useQuery } from '@tanstack/react-query';
import { CellContext, ColumnDef, Row } from '@tanstack/react-table';
import { useTable } from '@utils/hooks';
import useFieldForm, { FieldConfig } from '@utils/hooks/useFieldForm';
import { ArtworkDetail, CreateOrUpdateTransferOrderRequest, Status } from 'data-access/models';
import dateFnsFormat from 'date-fns/format';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Button, Dialog, DialogTrigger, Popover } from 'react-aria-components';
import { showConfirm, showError, showSuccess } from 'utils/swalUtil';
import * as yup from 'yup';

type FormData = {
  transporter?: string;
  transferTime?: Date;
  memo?: string;
};

const schema = yup.object().shape({
  transporter: yup.string().required('必填項目'),
  transferTime: yup.date().required('必填項目'),
  memo: yup.string().required('必填項目'),
});

interface TransferOrderDetailProps {
  disabled?: boolean;
}

const TransferOrderDetail: React.FC<TransferOrderDetailProps> = ({ disabled }) => {
  const router = useRouter();
  const { id } = useParams();

  const configs: FieldConfig<FormData>[] = [
    {
      type: 'TEXT',
      name: 'transporter',
      label: '運輸廠商',
      disabled: disabled,
      validated: yup.string().required('必填項目'),
    },
    {
      type: 'DATE',
      name: 'transferTime',
      label: '調撥日期',
      disabled: disabled,
      validated: yup.date().required('必填項目'),
    },
    {
      type: 'TEXT',
      name: 'memo',
      label: '備註',
      disabled: disabled,
      validated: yup.string().required('必填項目'),
    },
  ];

  const { fieldForm, setValue, handleSubmit } = useFieldForm<FormData>({
    configs: configs,
    resolver: yupResolver<FormData>(schema),
  });

  const [artworks, setArtworks] = useState<ArtworkDetail[]>([]);
  const [isOpenArtworksSelector, setIsOpenArtworksSelector] = useState(false);

  const { data, isLoading } = useQuery(
    ['fetchTransferOrderId', id],
    () => fetchTransferOrderId(+id),
    {
      enabled: !!disabled,
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    if (!data) return;

    const transferTime = parseDate(
      dateFnsFormat(new Date(data.transferTime), 'yyyy-MM-dd')
    ) as unknown as Date;

    setValue('transporter', data.transporter);
    setValue('transferTime', transferTime);
    setValue('memo', data.memo);
  }, [data]);

  const [rowSelection, setRowSelection] = useState<Record<ArtworkDetail['id'], ArtworkDetail>>({});

  const selectedRowCount = useMemo(() => Object.keys(rowSelection).length, [rowSelection]);

  const handleAllRowSelectionChange = (rows: Row<ArtworkDetail>[]) => {
    const selectedRows = rows.filter((row) => row.original.id in rowSelection);
    const isAnyRowSelected = selectedRows.length > 0;

    if (isAnyRowSelected) {
      selectedRows.forEach((row) => delete rowSelection[row.original.id]);
    } else {
      rows.forEach((row) => (rowSelection[row.original.id] = row.original));
    }

    setRowSelection(structuredClone(rowSelection));
  };

  const handleRowSelectionChange = (row: Row<ArtworkDetail>) => {
    const { id } = row.original;

    if (id in rowSelection) {
      delete rowSelection[id];
    } else {
      rowSelection[id] = row.original;
    }

    setRowSelection(structuredClone(rowSelection));
  };

  const columns: ColumnDef<ArtworkDetail, any>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <div className="flex items-center">
          {!disabled && (
            <IndeterminateCheckbox
              {...{
                checked: selectedRowCount > 0 && selectedRowCount > artworks.length,
                indeterminate: selectedRowCount > 0,
                onChange: () => handleAllRowSelectionChange(table.getRowModel().rows),
              }}
            />
          )}
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center">
          {!disabled && (
            <IndeterminateCheckbox
              {...{
                checked: row.original.id in rowSelection,
                indeterminate: false,
                onChange: () => handleRowSelectionChange(row),
              }}
            />
          )}
        </div>
      ),
    },
    {
      header: '編號',
      accessorKey: 'displayId',
      cell: ({ cell }) => (
        <Link
          className="text-info flex items-center whitespace-nowrap"
          href={`/artworks/${cell.getValue()}`}
        >
          {cell.getValue()}
          <PencilSquareIcon className="h-4 w-4 ml-2 inline-block"></PencilSquareIcon>
        </Link>
      ),
    },
    {
      header: '作品名稱',
      accessorKey: 'enName',
    },
    {
      header: '作品圖',
      accessorKey: 'displayImageUrl',
      cell: ({ cell }) => (
        <div>
          <DialogTrigger>
            <Button>
              <img src={cell.getValue()} alt="Artwork" loading="lazy" className="h-20" />
            </Button>
            <Popover placement="right">
              <Dialog className="h-[80vh]">
                <img
                  src={cell.getValue()}
                  alt="Artwork"
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </Dialog>
            </Popover>
          </DialogTrigger>
        </div>
      ),
    },
    {
      header: '藝術家',
      accessorKey: 'artists',
      cell: ({ cell }) => (
        <div>
          {cell
            .getValue<ArtworkDetail['artists']>()
            ?.map((artist) => `${artist.zhName} ${artist.enName}`)
            .join(',')}
        </div>
      ),
    },
    {
      id: 'media',
      header: '媒材',
      accessorKey: 'metadata',
      cell: ({ cell }: CellContext<ArtworkDetail, ArtworkDetail['metadata']>) =>
        cell.getValue()?.media ?? '無',
    },
    {
      id: 'size',
      header: '尺寸',
      accessorKey: 'metadata',
      cell: ({ cell }: CellContext<ArtworkDetail, ArtworkDetail['metadata']>) => {
        const { length, width, height } = cell.getValue<ArtworkDetail['metadata']>() || {};
        const lengthText = length && `長 ${length}`;
        const widthText = width && `寬 ${width}`;
        const heightText = height && `高 ${height}`;
        return lengthText && widthText && heightText
          ? `${lengthText} x ${widthText} x ${heightText}`
          : widthText && heightText
          ? `${widthText} x ${heightText}`
          : lengthText && widthText
          ? `${lengthText} x ${widthText}`
          : lengthText
          ? `${lengthText}`
          : widthText
          ? `${widthText}`
          : heightText
          ? `${heightText}`
          : '無';
      },
    },
    {
      id: 'year',
      header: '年代',
      cell: ({ row }) => {
        const { yearRangeStart, yearRangeEnd } = row.original;
        return yearRangeStart === yearRangeEnd
          ? yearRangeStart && yearRangeStart !== 0
            ? yearRangeEnd
            : '無'
          : `${yearRangeStart}~${yearRangeEnd}`;
      },
    },
    {
      id: 'otherInfo',
      header: '其他資訊',
      accessorKey: 'metadata',
      cell: ({ cell }: CellContext<ArtworkDetail, ArtworkDetail['metadata']>) => {
        const { frame, frameDimensions, pedestal, pedestalDimensions, cardboardBox, woodenBox } =
          cell.getValue()?.otherInfo || {};
        if (frame) return `表框${frameDimensions && `，尺寸 ${frameDimensions}`}`;
        if (pedestal) return `台座${pedestalDimensions && `，尺寸 ${pedestalDimensions}`}`;
        if (cardboardBox) return '紙箱';
        if (woodenBox) return '木箱';
        return '無';
      },
    },
    {
      id: 'storeType',
      header: '庫存狀態',
      accessorKey: 'metadata',
      cell: ({ cell }: CellContext<ArtworkDetail, ArtworkDetail['metadata']>) => {
        const storeTypeId = cell.getValue()?.storeType ?? 'inStock';
        return storeTypeOptionMap[storeTypeId].label;
      },
    },
    {
      id: 'salesType',
      header: '銷售狀態',
      accessorKey: 'metadata',
      cell: ({ cell }: CellContext<ArtworkDetail, ArtworkDetail['metadata']>) => {
        const salesTypeId = cell.getValue()?.salesType ?? 'unsold';
        return salesTypeOptionMap[salesTypeId].label;
      },
    },
    {
      id: 'assetsType',
      header: '資產類型',
      accessorKey: 'metadata',
      cell: ({ cell }: CellContext<ArtworkDetail, ArtworkDetail['metadata']>) => {
        const assetsTypeId = cell.getValue()?.assetsType ?? 'A';
        return assetsTypeOptionMap[assetsTypeId].label;
      },
    },
  ];

  const tableData = {
    data: (disabled ? data?.artworks : artworks) || [],
    totalCount: (disabled ? data?.artworks?.length : artworks.length) || 0,
  };

  const { table, tableBlock } = useTable({
    data: tableData,
    columns,
    isLoading,
  });

  const mutation = useMutation({
    mutationFn: (data: CreateOrUpdateTransferOrderRequest) => createTransferOrder(data),
    onSuccess: async () => {
      await showSuccess('新增成功！');
      router.back();
    },
    onError: async () => {
      await showError('新增失敗！');
    },
  });

  const onSubmit = async (formData: FormData) => {
    const { isConfirmed } = await showConfirm({
      title: '確定新增調撥單？',
      icon: 'question',
    });

    if (!isConfirmed) return;
    await mutation.mutateAsync({
      transporter: formData.transporter,
      transferTime: formData.transferTime,
      memo: formData.memo,
      artworkIdList: Object.values(rowSelection).map((row) => row.id),
      status: Status.Enabled,
    });
  };

  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl">
        <div className="flex gap-4 flex-col md:flex-row">
          <form className="w-full grid gap-4">{fieldForm}</form>

          <div className="flex flex-col gap-4 justify-between">
            <div className="flex md:flex-col gap-2">
              <button aria-label="export pdf file" className="btn btn-accent flex-1">
                表格匯出
              </button>
            </div>
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

        {!disabled && (
          <div className="flex items-center gap-2 py-2 mb-2">
            <span>已選擇 {selectedRowCount} 筆</span>
            <button className="btn btn-error" disabled={selectedRowCount === 0}>
              <TrashIcon className="h-5 w-5"></TrashIcon>
              刪除
            </button>
            <i className="flex-grow"></i>
            <button className="btn btn-info" onClick={() => setIsOpenArtworksSelector(true)}>
              <PlusIcon className="h-5 w-5"></PlusIcon>
              新增藝術品
            </button>
          </div>
        )}

        <div className="h-full w-full bg-base-100 text-center">
          {tableBlock}

          {!disabled && (
            <div className="bg-base-100 mt-4 md:col-span-2 flex gap-2 justify-center">
              <button className="btn btn-success" onClick={handleSubmit(onSubmit)}>
                <CheckIcon className="w-4"></CheckIcon> 儲存
              </button>
              <button
                className="btn btn-error btn-base-200"
                type="button"
                onClick={() => router.back()}
              >
                <XMarkIcon className="w-4"></XMarkIcon> 取消
              </button>
            </div>
          )}
        </div>
      </div>

      {!disabled && (
        <ArtworksSelector
          isOpen={isOpenArtworksSelector}
          onClose={(selectedArtworks) => {
            if (selectedArtworks && selectedArtworks.length > 0) {
              setArtworks((currentArtworks) => [...currentArtworks, ...selectedArtworks]);
            }
            setIsOpenArtworksSelector(false);
          }}
        ></ArtworksSelector>
      )}
    </>
  );
};

export default TransferOrderDetail;
