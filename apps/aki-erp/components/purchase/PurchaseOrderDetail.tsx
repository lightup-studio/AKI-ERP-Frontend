'use client';

import { useEffect, useState } from 'react';

import cx from 'classnames';
import dateFnsFormat from 'date-fns/format';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { showConfirm, showError, showSuccess } from 'utils/swalUtil';
import * as yup from 'yup';

import Button from '@components/shared/Button';
import { StoreType } from '@constants/artwork.constant';
import {
  createPurchaseOrder,
  exportPurchaseOrderById,
  fetchArtworkDetail,
  fetchPurchaseOrderId,
  patchArtworksBatchId,
} from '@data-access/apis';
import { ArtworkDetail, ArtworkMetadata, Status } from '@data-access/models';
import { CheckIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { yupResolver } from '@hookform/resolvers/yup';
import { parseDate } from '@internationalized/date';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useArtworksOrderTable } from '@utils/hooks';
import useFieldForm, { FieldConfig } from '@utils/hooks/useFieldForm';

type FormData = {
  salesCompany?: string;
  purchaseTime?: Date;
  salesInformation?: {
    name?: string;
    phone?: string;
  };
};

const schema = yup.object().shape({
  salesCompany: yup.string().required('必填項目'),
  purchaseTime: yup.date().required('必填項目'),
  salesInformation: yup.object({
    name: yup.string().required('必填項目'),
  }),
});

interface PurchaseOrderDetailProps {
  disabled?: boolean;
}

const PurchaseOrderDetail: React.FC<PurchaseOrderDetailProps> = ({ disabled }) => {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [draftArtworks, setDraftArtworks] = useState<ArtworkDetail<ArtworkMetadata>[]>([]);

  const configs: FieldConfig<FormData>[] = [
    {
      type: 'TEXT',
      name: 'salesCompany',
      label: '進貨單位',
      disabled: disabled,
    },
    {
      type: 'DATE',
      name: 'purchaseTime',
      label: '進貨日期',
      disabled: disabled,
    },
    {
      type: 'TEXT',
      name: 'salesInformation.name',
      label: '聯絡人',
      disabled: disabled,
    },
    {
      type: 'TEXT',
      name: 'salesInformation.phone',
      label: '聯絡人電話',
      disabled: disabled,
    },
  ];

  const { fieldForm, setValue, handleSubmit } = useFieldForm<FormData>({
    configs: configs,
    resolver: yupResolver<FormData>(schema),
  });

  const { data, isLoading } = useQuery(
    ['fetchPurchaseOrderId', +id],
    () => fetchPurchaseOrderId(+id),
    {
      enabled: !!disabled,
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    const artworkIds = searchParams.getAll('artworkId');
    Promise.all(artworkIds.map((item) => fetchArtworkDetail(item))).then((list) =>
      setDraftArtworks(list)
    );
  }, []);

  useEffect(() => {
    if (!data) return;

    const purchaseTime = data.purchaseTime
      ? (parseDate(dateFnsFormat(new Date(data.purchaseTime), 'yyyy-MM-dd')) as unknown as Date)
      : undefined;

    setValue('purchaseTime', purchaseTime);
    setValue('salesCompany', data.salesCompany);
    setValue('salesInformation', data.salesInformation);
  }, [data]);

  const { table, tableBlock } = useArtworksOrderTable({
    artworks: [...draftArtworks, ...(data?.artworks || [])],
    disabled,
    isLoading,
  });

  const createMutation = useMutation({
    mutationFn: (formData: FormData) => {
      const artworkIdList = table.getRowModel().rows.map((item) => item.original.id);

      return Promise.all([
        createPurchaseOrder({
          artworkIdList: artworkIdList,
          salesCompany: formData.salesCompany,
          purchaseTime: formData.purchaseTime,
          salesInformation: formData.salesInformation,
        }),
        patchArtworksBatchId({
          idList: artworkIdList,
          properties: {
            status: Status.Enabled,
            metadata: {
              storeType: StoreType.IN_STOCK,
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
      title: '確定新增進貨單？',
      icon: 'question',
    });

    if (!isConfirmed) return;
    await createMutation.mutateAsync(formData);
  };

  const exportOrderMutation = useMutation({
    mutationKey: ['exportPurchaseOrder', +id],
    mutationFn: exportPurchaseOrderById,
    onSuccess: ({ downloadPageUrl }) => {
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', downloadPageUrl);
      linkElement.setAttribute('target', '_blank');
      linkElement.click();
      linkElement.remove();
    },
  });

  const onExportOrder = async () => {
    await exportOrderMutation.mutateAsync(+id);
  };

  return (
    <>
      <div className="card w-full min-h-full p-6 bg-base-100 shadow-xl">
        <div className="flex gap-4 flex-col md:flex-row">
          <form className="w-full grid grid-cols-2 gap-4">{fieldForm}</form>

          <div className="flex flex-col gap-4 justify-between">
            <div className="flex md:flex-col gap-2">
              <button
                aria-label="export table"
                className={cx('btn btn-accent flex-1', {
                  'flex-nowrap whitespace-nowrap': exportOrderMutation.isLoading,
                })}
                onClick={onExportOrder}
                disabled={exportOrderMutation.isLoading}
              >
                {exportOrderMutation.isLoading ? (
                  <>
                    處理中 <span className="loading loading-ring loading-sm"></span>
                  </>
                ) : (
                  <>表格匯出</>
                )}
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

        <div className="divider my-2"></div>

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

export default PurchaseOrderDetail;
