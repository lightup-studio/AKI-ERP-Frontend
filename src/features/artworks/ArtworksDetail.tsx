import React, { ChangeEvent, useEffect } from 'react';

import {
  fetchArtworkDetail,
  updateArtworkDetail,
} from 'data-access/apis/artworks.api';
import { ArtworkDetail } from 'data-access/models';
import { setPageTitle } from 'features/common/headerSlice';
import { useFieldArray, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import * as yup from 'yup';

import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from '@tanstack/react-query';

import ArtworksTitle, { ArtworksTitleProps } from './ui/ArtworksTitle';
import classNames from 'classnames';
import { CheckIcon } from '@heroicons/react/20/solid';

const schema = yup.object().shape({
  image: yup.string(),
  artistNames: yup
    .array()
    .of(
      yup.object().shape({
        chineseName: yup.string(),
        englishName: yup.string(),
      })
    )
    .test('at-least-one-name', '請至少填寫中文名稱或英文名稱', (value) =>
      (value || []).some((item) => !!item.chineseName || !!item.englishName)
    ),

  assetCategory: yup.string().required('資產類別為必填項目'),
  type: yup.string().required('作品類型為必填項目'),
  agentGalleries: yup.array().of(
    yup.object().shape({
      name: yup.string().required('代理畫廊名稱為必填項目'),
    })
  ),
  nationality: yup.string().nonNullable().required('國籍為必填項目'),

  // purchasingUnit: yup.string().required('進貨單位為必填項目'),
  name: yup.string().required('作品名稱為必填項目'),
  // length: yup.string().required('請輸入長度'),
  // width: yup.string().required('請輸入寬度'),
  // height: yup.string().required('請輸入高度'),
  // customSize: yup.string().required('請輸入自定義尺寸'),
  // serialNumber: yup.string().required('號數為必填項目'),
  media: yup.string().required('媒材為必填項目'),
  startYear: yup
    .number()
    .typeError('請輸入數字')
    .transform((value, originValue) =>
      originValue.trim() === '' ? null : value
    )
    .nullable()
    .required('請輸入開始年份')
    .test(
      'is-valid-year',
      '請輸入有效的西元年份',
      (value) => !value || /^\d{4}$/.test(`${value}`)
    )
    .max(new Date().getFullYear(), '不得大於今年')
    .test(
      'start-year-less-than-or-equal-to-end-year',
      '不得大於結束年份',
      function (value) {
        const endYear = (this.parent as ArtworkDetail).endYear;
        return !endYear || !value || value <= endYear;
      }
    ),
  endYear: yup
    .number()
    .typeError('請輸入數字')
    .transform((value, originValue) =>
      originValue.trim() === '' ? null : value
    )
    .nullable()
    .required('請輸入結束年份')
    .test(
      'is-valid-year',
      '請輸入有效的西元年份',
      (value) => !value || /^\d{4}$/.test(`${value}`)
    )
    .test(
      'end-year-greater-than-start-year',
      '不得小於開始年份',
      function (value) {
        const startYear = (this.parent as ArtworkDetail).startYear || 0;
        return !value || value >= startYear;
      }
    )
    .max(new Date().getFullYear(), '不得大於今年'),
  edition: yup.string().required('請輸入版次'),

  otherInfo: yup.object().shape({
    frame: yup.boolean(),
    frameDimensions: yup.string().when('frame', (frame, field) => {
      return frame ? field.required('請輸入表框尺寸') : field;
    }),
    pedestal: yup.boolean(),
    pedestalDimensions: yup.string().when('pedestal', (pedestal, field) => {
      return pedestal ? field.required('請輸入台座尺寸') : field;
    }),
    cardboardBox: yup.boolean(),
    woodBox: yup.boolean(),
  }),

  warehouseId: yup.string().required('請選擇在庫位置'),
});

type ArtworksDetailProps = Pick<ArtworksTitleProps, 'type'>;

function ArtworksDetail({ type }: ArtworksDetailProps) {
  const params = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setPageTitle({
        title: (
          <ArtworksTitle id={params.artworksId} type={type} pageType="detail" />
        ),
      })
    );
  }, [dispatch, params.artworksId, type]);

  const { isLoading, isSuccess, data } = useQuery(
    ['data', params.artworksId],
    () => fetchArtworkDetail(params.artworksId || ''),
    {
      enabled: !!params.artworksId, // only run the query if the id exists
    }
  );

  const mutation = useMutation({
    mutationFn: (data: ArtworkDetail) =>
      updateArtworkDetail(params.artworksId || '', data),
    onSuccess: (data) => {
      console.log(data);
      console.log('%c Line:97 🍐', 'color:#2eafb0');
    },
  });

  const {
    control,
    reset,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ArtworkDetail>({
    defaultValues: {
      artistNames: [
        {
          chineseName: '',
          englishName: '',
        },
      ],
      assetCategory: null,
      type: null,
      agentGalleries: [{ name: '' }],
      nationality: null,
      warehouseId: null,
    },
    resolver: yupResolver(schema),
    mode: 'all',
  });

  React.useEffect(() => {
    if (isSuccess) {
      reset(data);
    }
  }, [isSuccess, data, reset]);

  const {
    fields: artworkNameFields,
    append: appendArtworkNames,
    remove: removeArtworkNames,
  } = useFieldArray({
    control,
    name: 'artistNames',
  });

  const {
    fields: agentGalleryFields,
    append: appendAgentGalleries,
    remove: removeAgentGalleries,
  } = useFieldArray({
    control,
    name: 'agentGalleries',
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const data = e.target.result as string;
          const img = new Image();
          img.src = data;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            const base64 = canvas.toDataURL('image/jpeg');
            setValue('image', base64);
            console.log(base64);
          };
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ArtworkDetail) => {
    await mutation.mutateAsync(data);
  };

  if (!!params.artworksId && isLoading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-base-100 p-4 flex flex-col gap-5 rounded-md shadow-md">
          <div className="flex gap-3">
            <button className="btn btn-outline">庫存資訊</button>
            <button className="btn btn-outline">銷售資訊</button>
          </div>

          <label className="font-bold">作品圖片</label>
          <input
            type="file"
            className="file-input file-input-bordered max-w-xs"
            onChange={handleFileChange}
          />
          {watch('image') && (
            <img src={watch('image')} className="w-full" alt="作品圖片" />
          )}

          <label className="font-bold">藝術家</label>
          <div className="flex flex-wrap gap-2">
            {artworkNameFields.map((field, index) => (
              <div className="form-control" key={field.id}>
                <div className="input-group border rounded-lg border-base-200">
                  <div className="bg-base-200 p-1 flex items-center gap-1 flex-wrap">
                    <input
                      className="input text-center flex-1 rounded-r-none"
                      placeholder="中文名稱"
                      {...register(`artistNames.${index}.chineseName`)}
                    />
                    <input
                      className="input text-center flex-1 rounded-l-none"
                      placeholder="英文名稱"
                      {...register(`artistNames.${index}.englishName`)}
                    />
                  </div>
                  <button
                    type="button"
                    className="btn h-full"
                    onClick={() => removeArtworkNames(index)}
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              className="btn btn-accent mt-1"
              onClick={() =>
                appendArtworkNames({ chineseName: '', englishName: '' })
              }
            >
              <PlusIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="bg-base-100 p-4 flex flex-col gap-5 rounded-md shadow-md">
          <div className="flex flex-col gap-2 pb-2">
            <label className="font-bold">資產類別</label>
            <div className="relative">
              <select
                className={classNames(
                  'select select-bordered text-lg w-full max-w-xs',
                  {
                    'select-error': errors.assetCategory,
                  }
                )}
                {...register('assetCategory')}
              >
                <option value="" disabled>
                  請選擇
                </option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
              {errors.assetCategory && (
                <p className="absolute text-error text-xs italic">
                  {errors.assetCategory.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 pb-2">
            <label className="font-bold">作品類型</label>
            <div className="relative">
              <select
                className={classNames(
                  'select select-bordered text-lg w-full max-w-xs',
                  {
                    'select-error': errors.type,
                  }
                )}
                {...register('type')}
              >
                <option value="" disabled>
                  請選擇
                </option>
                <option value="繪畫">繪畫</option>
                <option value="雕塑">雕塑</option>
                <option value="公仔">公仔</option>
              </select>
              {errors.type && (
                <p className="absolute text-error text-xs italic">
                  {errors.type.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 pb-2">
            <label className="font-bold">代理藝廊</label>
            <div className="flex flex-wrap gap-2">
              {agentGalleryFields.map((field, index) => (
                <div className="form-control" key={field.id}>
                  <div className="input-group border rounded-lg border-base-200">
                    <div className="bg-base-200 p-1 flex items-center gap-2 flex-wrap">
                      <input
                        className="input text-center flex-1 rounded-r-none"
                        placeholder="藝廊名稱"
                        {...register(`agentGalleries.${index}.name`)}
                      />
                    </div>
                    <button
                      type="button"
                      className="btn h-full"
                      onClick={() => removeAgentGalleries(index)}
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                className="btn btn-accent mt-1"
                onClick={() => appendAgentGalleries({ name: '' })}
              >
                <PlusIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2 pb-2">
            <label className="font-bold">國籍</label>
            <div className="relative">
              <select
                className={classNames(
                  'select select-bordered text-lg w-full max-w-xs',
                  {
                    'select-error': errors.nationality,
                  }
                )}
                {...register('nationality')}
              >
                <option value="" disabled>
                  請選擇
                </option>
                <option value="Taiwan">Taiwan</option>
                <option value="USA">USA</option>
                <option value="Japan">Japan</option>
              </select>
              {errors.nationality && (
                <p className="absolute text-error text-xs italic">
                  {errors.nationality.message}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="bg-base-100 p-4 md:col-span-2 divide-y rounded-md shadow-md">
          <div className="flex flex-col gap-5 pb-6">
            <div className="flex items-center gap-2">
              <label className="font-bold">進貨單位</label>
              <div className="relative flex-1">
                <input
                  className={classNames(
                    'input input-bordered w-full max-w-xs',
                    {
                      'input-error': errors.purchasingUnit,
                    }
                  )}
                  {...register('purchasingUnit')}
                />
                {errors.purchasingUnit && (
                  <p className="absolute text-error text-xs italic">
                    {errors.purchasingUnit.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="font-bold">作品名稱</label>
              <div className="relative flex-1">
                <input
                  className={classNames(
                    'input input-bordered w-full max-w-xs',
                    {
                      'input-error': errors.name,
                    }
                  )}
                  {...register('name')}
                />
                {errors.name && (
                  <p className="absolute text-error text-xs italic">
                    {errors.name.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 flex-wrap md:flex-no-wrap">
              <label className="font-bold">尺寸</label>
              <div className="flex flex-wrap flex-1 gap-4">
                <div className="flex gap-2 items-center">
                  <label>長</label>
                  <div className="relative flex-1">
                    <input
                      className={classNames(
                        'input input-bordered w-full max-w-xs',
                        {
                          'input-error': errors.length,
                        }
                      )}
                      {...register('length')}
                    />
                    {errors.length && (
                      <p className="absolute text-error text-xs italic">
                        {errors.length.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <label>寬</label>
                  <div className="relative flex-1">
                    <input
                      className={classNames(
                        'input input-bordered w-full max-w-xs',
                        {
                          'input-error': errors.width,
                        }
                      )}
                      {...register('width')}
                    />
                    {errors.width && (
                      <p className="absolute text-error text-xs italic">
                        {errors.width.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <label>高</label>
                  <div className="relative flex-1">
                    <input
                      className={classNames(
                        'input input-bordered w-full max-w-xs',
                        {
                          'input-error': errors.height,
                        }
                      )}
                      {...register('height')}
                    />
                    {errors.height && (
                      <p className="absolute text-error text-xs italic">
                        {errors.height.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <label className="whitespace-nowrap">自定義尺寸</label>
                  <div className="relative flex-1">
                    <input
                      className={classNames(
                        'input input-bordered w-full max-w-xs',
                        {
                          'input-error': errors.customSize,
                        }
                      )}
                      {...register('customSize')}
                    />
                    {errors.customSize && (
                      <p className="absolute text-error text-xs italic">
                        {errors.customSize.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <label className="whitespace-nowrap">號數</label>
                  <div className="relative flex-1">
                    <input
                      className={classNames(
                        'input input-bordered w-full max-w-xs',
                        {
                          'input-error': errors.serialNumber,
                        }
                      )}
                      {...register('serialNumber')}
                    />
                    {errors.serialNumber && (
                      <p className="absolute text-error text-xs italic">
                        {errors.serialNumber.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="font-bold">媒材</label>
              <div className="relative flex-1">
                <input
                  className={classNames(
                    'input input-bordered w-full max-w-xs',
                    {
                      'input-error': errors.media,
                    }
                  )}
                  {...register('media')}
                />
                {errors.media && (
                  <p className="absolute text-error text-xs italic">
                    {errors.media.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="font-bold">年代</label>
              <div className="flex flex-row items-center flex-1">
                <div className="relative">
                  <input
                    className={classNames('input input-bordered w-28', {
                      'input-error': errors.startYear,
                    })}
                    {...register('startYear')}
                  />
                  {errors.startYear && (
                    <p className="absolute text-error text-xs italic">
                      {errors.startYear.message}
                    </p>
                  )}
                </div>
                <span className="h-[1px] w-3 bg-base-content mx-2"></span>
                <div className="relative">
                  <input
                    className={classNames('input input-bordered w-28', {
                      'input-error': errors.endYear,
                    })}
                    {...register('endYear')}
                  />
                  {errors.endYear && (
                    <p className="absolute text-error text-xs italic">
                      {errors.endYear.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="font-bold">版次 ed.</label>
              <div className="relative flex-1">
                <input
                  className={classNames(
                    'input input-bordered w-full max-w-xs',
                    {
                      'input-error': errors.edition,
                    }
                  )}
                  {...register('edition')}
                />
                {errors.edition && (
                  <p className="absolute text-error text-xs italic">
                    {errors.edition.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-2 flex-col md:flex-row md:items-center">
              <label className="font-bold">其他資訊</label>
              <div className="flex flex-row flex-1 flex-wrap gap-2">
                <div className="flex gap-2">
                  <label className="flex items-center gap-2 label-text whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-secondary"
                      {...register('otherInfo.frame')}
                    />
                    表框，尺寸
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    {...register('otherInfo.frameDimensions')}
                    disabled={!watch('otherInfo.frame')}
                  />
                </div>
                <div className="flex gap-2">
                  <label className="flex items-center gap-2 label-text">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-secondary"
                      {...register('otherInfo.pedestal')}
                    />
                    台座，尺寸
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    {...register('otherInfo.pedestalDimensions')}
                    disabled={!watch('otherInfo.pedestal')}
                  />
                </div>
                <div className="flex gap-2 py-3">
                  <label className="flex items-center gap-2 label-text">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-secondary"
                      {...register('otherInfo.cardboardBox')}
                    />
                    紙箱
                  </label>
                </div>
                <div className="flex gap-2 py-3">
                  <label className="flex items-center gap-2 label-text">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-secondary"
                      {...register('otherInfo.woodenBox')}
                    />
                    木箱
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5 py-5">
            <h2 className="text-2xl text-accent font-bold">庫存資訊</h2>

            <div className="flex flex-wrap items-center gap-2">
              <label className="font-bold">在庫位置</label>
              <div className="flex flex-row gap-2">
                <div className="relative">
                  <select
                    className={classNames('select select-bordered text-lg', {
                      'select-error': errors.warehouseId,
                    })}
                    {...register('warehouseId')}
                  >
                    <option value={''} disabled>
                      請選擇
                    </option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                  </select>
                  {errors.warehouseId && (
                    <p className="absolute text-error text-xs italic">
                      {errors.warehouseId.message}
                    </p>
                  )}
                </div>
                <input
                  type="text"
                  className="input input-bordered"
                  placeholder="自填位置"
                  {...register('warehouseLocation')}
                />
              </div>
            </div>

            <div className="flex items-start gap-2 flex-col md:flex-row md:items-center">
              <label className="font-bold whitespace-nowrap">庫存狀態</label>
              <div className="flex flex-wrap items-center gap-2">
                <label className="label gap-2">
                  <input
                    type="radio"
                    className="radio radio-secondary"
                    value="lend"
                    {...register('stockType')}
                  />
                  <span className="label-text">借展，單位</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  disabled={watch('stockType') !== 'lend'}
                  {...register('lendDepartment')}
                />

                <label className="label gap-2">
                  <input
                    type="radio"
                    className="radio radio-secondary"
                    value="repair"
                    {...register('stockType')}
                  />
                  <span className="label-text">維修，單位</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  disabled={watch('stockType') !== 'repair'}
                  {...register('repairDepartment')}
                />
                <label className="label gap-2 pl-0">
                  <span className="label-text">，狀態說明</span>
                  <input
                    type="text"
                    className="input input-bordered"
                    disabled={watch('stockType') !== 'repair'}
                    {...register('repairNote')}
                  />
                </label>

                <label className="label gap-2">
                  <input
                    type="radio"
                    className="radio radio-secondary"
                    value="returnedRepair"
                    {...register('stockType')}
                  />
                  <span className="label-text">已歸還，單位</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  disabled={watch('stockType') !== 'returnedRepair'}
                  {...register('returnRepairDepartment')}
                />

                <label className="label gap-2">
                  <input
                    type="radio"
                    className="radio radio-secondary"
                    value="shipping"
                    {...register('stockType')}
                  />
                  <span className="label-text">已出貨</span>
                </label>

                <label className="label gap-2">
                  <input
                    type="radio"
                    className="radio radio-secondary"
                    value="returnedShipping"
                    {...register('stockType')}
                  />
                  <span className="label-text">已退回，單位</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  disabled={watch('stockType') !== 'returnedShipping'}
                  {...register('returnedShippingDepartment')}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5 py-5">
            <h2 className="text-2xl text-accent font-bold">銷售資訊</h2>

            <div className="flex items-center gap-2">
              <label className="font-bold">購買人</label>
              <span className="input input-bordered flex items-center">
                這是都是從建立銷售單的帶過來的欄位嗎?
              </span>
            </div>

            <div className="flex items-center gap-2">
              <label className="font-bold">收件者</label>
              <span className="input input-bordered flex items-center">
                這是都是從建立銷售單的帶過來的欄位嗎?
              </span>
            </div>

            <div className="flex items-center gap-2">
              <label className="font-bold">電話</label>
              <span className="input input-bordered flex items-center">
                這是都是從建立銷售單的帶過來的欄位嗎?
              </span>
            </div>

            <div className="flex items-center gap-2">
              <label className="font-bold">地址</label>
              <span className="input input-bordered flex items-center">
                這是都是從建立銷售單的帶過來的欄位嗎?
              </span>
            </div>

            <div className="flex items-center gap-2">
              <label className="font-bold">售出日期</label>
              <span className="input input-bordered flex items-center">
                這是都是從建立銷售單的帶過來的欄位嗎?
              </span>
            </div>
          </div>
        </div>

        <div className="bg-base-100 p-4 md:col-span-2 rounded-md shadow-md">
          <div className="flex justify-center gap-2">
            <button className="btn btn-success">
              <CheckIcon className="w-4"></CheckIcon> 儲存
            </button>
            <button className="btn btn-error btn-base-200" type="button">
              <XMarkIcon className="w-4"></XMarkIcon> 取消
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default ArtworksDetail;
