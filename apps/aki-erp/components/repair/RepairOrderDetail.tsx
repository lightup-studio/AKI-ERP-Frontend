'use client';

import { useEffect } from 'react';

import dateFnsFormat from 'date-fns/format';
import { useParams, useRouter } from 'next/navigation';
import { showConfirm, showError, showSuccess } from 'utils/swalUtil';
import * as yup from 'yup';

import Button from '@components/shared/Button';
import { StoreType } from '@constants/artwork.constant';
import {
  createRepairOrder,
  exportRepairOrderById,
  fetchRepairOrderId,
  patchArtworksBatchId,
} from '@data-access/apis';
import { CheckIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { yupResolver } from '@hookform/resolvers/yup';
import { parseDate } from '@internationalized/date';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useArtworksOrderTable } from '@utils/hooks';
import useFieldForm, { FieldConfig } from '@utils/hooks/useFieldForm';

type FormData = {
  repairDepartment?: string;
  repairTime?: Date;
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
  repairDepartment: yup.string().required('必填項目'),
  repairTime: yup.date().required('必填項目'),
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
});

interface RepairOrderDetailProps {
  disabled?: boolean;
}

const RepairOrderDetail: React.FC<RepairOrderDetailProps> = ({ disabled }) => {
  const router = useRouter();
  const { id } = useParams();

  const configs: FieldConfig<FormData>[] = [
    {
      type: 'TEXT',
      name: 'repairDepartment',
      label: '維修單位',
      disabled: disabled,
    },
    {
      type: 'DATE',
      name: 'repairTime',
      label: '維修日期',
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

  const { data, isLoading } = useQuery(['fetchRepairOrderId', id], () => fetchRepairOrderId(+id), {
    enabled: !!disabled,
    keepPreviousData: true,
  });

  useEffect(() => {
    if (!data) return;

    const repairTime = data.repairTime
      ? (parseDate(dateFnsFormat(new Date(data.repairTime), 'yyyy-MM-dd')) as unknown as Date)
      : undefined;

    setValue('repairTime', repairTime);
    setValue('contactPersonInformation', data.contactPersonInformation);
    setValue('receiverInformation', data.receiverInformation);
    setValue('repairDepartment', data.repairDepartment);
    setValue('memo', data.memo);
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
        createRepairOrder({
          artworkIdList: artworkIdList,
          repairTime: formData.repairTime,
          repairDepartment: formData.repairDepartment,
          receiverInformation: formData.receiverInformation,
          contactPersonInformation: formData.contactPersonInformation,
          memo: formData.memo,
        }),
        patchArtworksBatchId({
          idList: artworkIdList,
          properties: {
            metadata: {
              storeType: StoreType.REPAIR,
              repairDepartment: formData.repairDepartment,
              returnRepairDepartment: undefined,
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
      title: '確定新增維修單？',
      icon: 'question',
    });

    if (!isConfirmed) return;
    await createMutation.mutateAsync(formData);
  };

  const exportOrderMutation = useMutation({
    mutationKey: ['exportRepairOrder', +id],
    mutationFn: exportRepairOrderById,
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
              {/* <button
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
              </button> */}
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

        <div className="bg-base-100 h-full w-full text-center">
          {tableBlock}

          {!disabled && (
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
          )}
        </div>
      </div>
    </>
  );
};

export default RepairOrderDetail;
