'use client';

import { useEffect } from 'react';

import Button from '@components/shared/Button';
import { StoreType } from '@constants/artwork.constant';
import { createSalesOrder, fetchSalesOrderId, patchArtworksBatchId } from '@data-access/apis';
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
  memo: yup.string().required('必填項目'),
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
      disabled: disabled,
    },
    {
      type: 'DATE',
      name: 'shippingTime',
      label: '出貨日期',
      disabled: disabled,
    },
    {
      type: 'TEXT',
      name: 'contactPersonInformation.name',
      label: '聯絡人',
      disabled: disabled,
    },
    {
      type: 'TEXT',
      name: 'contactPersonInformation.phone',
      label: '聯絡人電話',
      disabled: disabled,
    },
    {
      type: 'TEXT',
      name: 'receiverInformation.name',
      label: '收件人',
      disabled: disabled,
    },
    {
      type: 'TEXT',
      name: 'receiverInformation.phone',
      label: '收件人電話',
      disabled: disabled,
    },
    {
      type: 'TEXT',
      name: 'receiverInformation.address',
      label: '地址',
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
    setValue('memo', data.memo);
  }, [data]);

  const { rowSelection, table, tableBlock } = useArtworksOrderTable({
    artworks: data?.artworks,
    disabled,
    isLoading,
  });

  const createMutation = useMutation({
    mutationFn: (formData: FormData) => {
      const artworkIdList = Object.values(rowSelection).map((row) => row.id);

      return Promise.all([
        createSalesOrder({
          artworkIdList: artworkIdList,
          shippingTime: formData.shippingTime,
          shippingDepartment: formData.shippingDepartment,
          receiverInformation: formData.receiverInformation,
          contactPersonInformation: formData.contactPersonInformation,
          memo: formData.memo,
        }),
        patchArtworksBatchId({
          idList: artworkIdList,
          properties: {
            metadata: {
              storeType: StoreType.SHIPPING,
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

  const onSubmit = async (formData: FormData) => {
    const { isConfirmed } = await showConfirm({
      title: '確定新增出貨單？',
      icon: 'question',
    });

    if (!isConfirmed) return;
    await createMutation.mutateAsync(formData);
  };

  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl">
        <div className="flex gap-4 flex-col md:flex-row">
          <form className="w-full grid grid-cols-2 gap-4">{fieldForm}</form>

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

export default ShipmentOrderDetail;