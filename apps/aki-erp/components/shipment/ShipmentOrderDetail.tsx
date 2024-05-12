'use client';

import { useEffect } from 'react';

import cx from 'classnames';
import dateFnsFormat from 'date-fns/format';
import { useParams, useRouter } from 'next/navigation';
import { showConfirm, showError, showSuccess } from 'utils/swalUtil';
import * as yup from 'yup';

import Button from '@components/shared/Button';
import { StoreType } from '@constants/artwork.constant';
import { PAGE_SIZES } from '@constants/page.constant';
import {
  createSalesOrder,
  exportSalesOrderById,
  fetchSalesOrderId,
  patchArtworksBatchId,
  updateSalesOrder,
} from '@data-access/apis';
import { CheckIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { yupResolver } from '@hookform/resolvers/yup';
import { parseDate } from '@internationalized/date';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useArtworksOrderTable } from '@utils/hooks';
import useFieldForm, { FieldConfig } from '@utils/hooks/useFieldForm';

type FormData = {
  shippingDepartment?: string;
  shippingTime?: Date;
  contactPersonInformation?: {
    name?: string;
    phone?: string;
  };
  receiverInformation?: {
    name?: string;
    phone?: string;
    address?: string;
  };
  memo?: string;
  metadata?: {
    carrier?: string;
  };
};

const schema = yup.object().shape({
  shippingDepartment: yup.string().required('必填項目'),
  shippingTime: yup.date().required('必填項目'),
  contactPersonInformation: yup.object({
    name: yup.string().required('必填項目'),
    phone: yup.string().required('必填項目'),
  }),
  receiverInformation: yup.object({
    name: yup.string().required('必填項目'),
    phone: yup.string().required('必填項目'),
    address: yup.string().required('必填項目'),
  }),
  memo: yup.string(),
  metadata: yup.object({
    carrier: yup.string(),
  }),
});

interface ShipmentOrderDetailProps {
  disabled?: boolean;
}

const ShipmentOrderDetail: React.FC<ShipmentOrderDetailProps> = ({ disabled }) => {
  const router = useRouter();
  const { id } = useParams();

  const configs: FieldConfig<FormData>[] = [
    {
      type: 'TEXT',
      name: 'shippingDepartment',
      label: '出貨單位',
    },
    {
      type: 'DATE',
      name: 'shippingTime',
      label: '出貨日期',
    },
    {
      type: 'TEXT',
      name: 'contactPersonInformation.name',
      label: '聯絡人',
    },
    {
      type: 'TEXT',
      name: 'contactPersonInformation.phone',
      label: '聯絡人電話',
    },
    {
      type: 'TEXT',
      name: 'receiverInformation.name',
      label: '收件人',
    },
    {
      type: 'TEXT',
      name: 'receiverInformation.phone',
      label: '收件人電話',
    },
    {
      type: 'TEXT',
      name: 'receiverInformation.address',
      label: '地址',
    },
    {
      type: 'TEXT',
      name: 'memo',
      label: '備註',
    },
    {
      type: 'TEXT',
      name: 'metadata.carrier',
      label: '承運人',
    },
  ];

  const { fieldForm, setValue, handleSubmit } = useFieldForm<FormData>({
    configs: configs,
    resolver: yupResolver<FormData>(schema),
  });

  const { data, isLoading } = useQuery(['fetchSalesOrderId', id], () => fetchSalesOrderId(+id), {
    enabled: !!disabled,
    keepPreviousData: true,
  });

  useEffect(() => {
    if (!data) return;

    const shippingTime = data.shippingTime
      ? (parseDate(dateFnsFormat(new Date(data.shippingTime), 'yyyy-MM-dd')) as unknown as Date)
      : undefined;

    setValue('shippingTime', shippingTime);
    setValue('contactPersonInformation', data.contactPersonInformation);
    setValue('receiverInformation', data.receiverInformation);
    setValue('shippingDepartment', data.shippingDepartment);
    setValue('memo', data.memo || '');
    setValue('metadata', data.metadata);
  }, [data]);

  const { table, tableBlock } = useArtworksOrderTable({
    artworks: data?.artworks,
    disabled,
    isLoading,
  });

  const createMutation = useMutation({
    mutationFn: (formData: FormData) => {
      const artworkIdList = table.getRowModel().rows.map((item) => item.original.id);

      return Promise.all([
        createSalesOrder({
          artworkIdList: artworkIdList,
          shippingTime: formData.shippingTime,
          shippingDepartment: formData.shippingDepartment,
          receiverInformation: formData.receiverInformation,
          contactPersonInformation: formData.contactPersonInformation,
          memo: formData.memo,
          metadata: formData.metadata,
        }),
        patchArtworksBatchId({
          idList: artworkIdList,
          properties: {
            metadata: {
              storeType: StoreType.SHIPPING,
              salesType: 'sold',
              shippingDepartment: formData.shippingDepartment,
              returnedShippingDepartment: undefined,
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

  const updateMutation = useMutation({
    mutationFn: (formData: FormData) => updateSalesOrder(formData),
  });

  useEffect(() => {
    if (updateMutation.isSuccess) showSuccess('更新成功！');
    if (updateMutation.isError) showError('更新失敗！');
  }, [updateMutation.isSuccess, updateMutation.isError]);

  const onSubmit = async (formData: FormData) => {
    const { isConfirmed } = await showConfirm({
      title: '確定新增出貨單？',
      icon: 'question',
    });

    if (!isConfirmed) return;
    await createMutation.mutateAsync(formData);
  };

  const onUpdate = async (formData: FormData) => {
    const { isConfirmed } = await showConfirm({
      title: '確定修改嗎？',
      icon: 'warning',
    });

    if (!isConfirmed) return;
    await updateMutation.mutateAsync(formData);
  };

  const exportOrderMutation = useMutation({
    mutationKey: ['exportSalesOrder', +id],
    mutationFn: exportSalesOrderById,
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
      <div className="card bg-base-100 min-h-full w-full p-6 shadow-xl">
        <div className="flex flex-col gap-4 md:flex-row">
          <form className="grid w-full grid-cols-2 gap-4">{fieldForm}</form>

          <div className="mt-8 flex flex-col justify-between gap-4">
            <div className="flex gap-2 md:flex-col">
              <button
                aria-label="export pdf file"
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
                  <>PDF 匯出</>
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
              {PAGE_SIZES.map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize} 筆
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="divider my-2"></div>

        <div className="bg-base-100 h-full w-full text-center">
          {tableBlock}

          {!disabled ? (
            <div className="bg-base-100 mt-4 flex justify-center gap-2 md:col-span-2">
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
          ) : (
            <div className="bg-base-100 my-4">
              <button className="btn btn-warning" onClick={handleSubmit(onUpdate)}>
                修改
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ShipmentOrderDetail;
