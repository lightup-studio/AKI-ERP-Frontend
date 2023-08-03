'use client';

import { useEffect } from 'react';

import Button from '@components/shared/Button';
import { StoreType } from '@constants/artwork.constant';
import { createTransferOrder, fetchTransferOrderId, patchArtworksBatchId } from '@data-access/apis';
import { CheckIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { yupResolver } from '@hookform/resolvers/yup';
import { parseDate } from '@internationalized/date';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useArtworksOrderTable } from '@utils/hooks';
import useFieldForm, { FieldConfig } from '@utils/hooks/useFieldForm';
import dateFnsFormat from 'date-fns/format';
import { useParams, useRouter } from 'next/navigation';
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
    },
    {
      type: 'DATE',
      name: 'transferTime',
      label: '調撥日期',
      disabled: disabled,
    },
    {
      type: 'TEXT',
      name: 'memo',
      label: '備註',
      disabled: disabled,
    },
  ];

  const { fieldForm, setValue, handleSubmit } = useFieldForm<FormData>({
    configs: configs,
    resolver: yupResolver<FormData>(schema),
  });

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

    const transferTime = data.transferTime
      ? (parseDate(dateFnsFormat(new Date(data.transferTime), 'yyyy-MM-dd')) as unknown as Date)
      : undefined;

    setValue('transporter', data.transporter);
    setValue('transferTime', transferTime);
    setValue('memo', data.memo);
  }, [data]);

  const { table, tableBlock, rowSelection } = useArtworksOrderTable({
    artworks: data?.artworks,
    disabled,
    isLoading,
  });

  const createMutation = useMutation({
    mutationFn: (formData: FormData) => {
      const artworkIdList = Object.values(rowSelection).map((row) => row.id);

      return Promise.all([
        createTransferOrder({
          artworkIdList: artworkIdList,
          transporter: formData.transporter,
          transferTime: formData.transferTime,
          memo: formData.memo,
        }),
        patchArtworksBatchId({
          idList: artworkIdList,
          properties: {
            metadata: {
              storeType: StoreType.NONE,
            },
          },
        }),
      ]);
    },
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
    await createMutation.mutateAsync(formData);
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

        <div className="h-full w-full bg-base-100 text-center">
          {tableBlock}

          {!disabled && (
            <div className="bg-base-100 mt-4 md:col-span-2 flex gap-2 justify-center">
              <Button
                className="btn btn-success"
                isLoading={createMutation.isLoading}
                onClick={handleSubmit(onSubmit)}
              >
                <CheckIcon className="w-4"></CheckIcon> 儲存
              </Button>
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
    </>
  );
};

export default TransferOrderDetail;
