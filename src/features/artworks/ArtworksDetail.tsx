import React, { ChangeEvent, useEffect, useState } from 'react';

import classNames from 'classnames';
import { createOrUpdateArtworkDetail, fetchArtworkDetailByDisplayId } from 'data-access/apis/artworks.api';
import { uploadImageToS3 } from 'data-access/apis/files.api';
import { ArtworkDetail } from 'data-access/models';
import { setPageTitle } from 'features/common/headerSlice';
import { useFieldArray, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { assetsTypeOptions } from 'src/constants/artwork.constant';
import { showError, showSuccess } from 'utils/swalUtil';
import * as yup from 'yup';

import { CheckIcon } from '@heroicons/react/20/solid';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from '@tanstack/react-query';

import ArtworksTitle, { ArtworksTitleProps } from './ui/ArtworksTitle';

const schema = yup.object().shape({
  warehouseId: yup.number().required('庫存位置為必填項目'),
  enName: yup.string().required('作品名稱為必填項目'),
  zhName: yup.string(),
  imageUrl: yup.string().required('請確認圖片是否已上傳？'),
  thumbnailUrl: yup.string(),
  countryCode: yup.string().nonNullable().required('國籍為必填項目'),
  artists: yup.array().of(
    yup
      .object()
      .shape({
        zhName: yup.string(),
        enName: yup.string(),
      })
      .test('at-least-one-name', '至少需要提供中文名稱或英文名稱', function (value) {
        return !!value.zhName || !!value.enName;
      })
  ),
  yearRangeStart: yup
    .number()
    .typeError('請輸入數字')
    .transform((value, originValue) => (originValue?.trim?.() === '' ? null : value))
    .nullable()
    .required('請輸入開始年份')
    .test('is-valid-year', '請輸入有效的西元年份', (value) => !value || /^\d{4}$/.test(`${value}`))
    .max(new Date().getFullYear(), '不得大於今年')
    .test('start-year-less-than-or-equal-to-end-year', '不得大於結束年份', function (value) {
      const endYear = (this.parent as ArtworkDetail).yearRangeEnd;
      return !endYear || !value || value <= endYear;
    }),
  yearRangeEnd: yup
    .number()
    .typeError('請輸入數字')
    .transform((value, originValue) => (originValue?.trim?.() === '' ? null : value))
    .nullable()
    .required('請輸入結束年份')
    .test('is-valid-year', '請輸入有效的西元年份', (value) => !value || /^\d{4}$/.test(`${value}`))
    .test('end-year-greater-than-start-year', '不得小於開始年份', function (value) {
      const startYear = (this.parent as ArtworkDetail).yearRangeStart || 0;
      return !value || value >= startYear;
    })
    .max(new Date().getFullYear(), '不得大於今年'),

  metadata: yup.object().shape({
    artworkType: yup.string().required('作品類型為必填項目'),
    assetsType: yup.string().required('資產類別為必填項目'),
    agentGalleries: yup.array().of(
      yup.object().shape({
        name: yup.string().required('代理畫廊名稱為必填項目'),
      })
    ),
    media: yup.string().required('媒材為必填項目'),
    edition: yup.string().required('請輸入版次'),
    otherInfo: yup.object().shape({
      frame: yup.boolean(),
      frameDimensions: yup.string().when('frame', ([frame], field) => {
        return frame ? field.required('請輸入表框尺寸') : field;
      }),
      pedestal: yup.boolean(),
      pedestalDimensions: yup.string().when('pedestal', ([pedestal], field) => {
        return pedestal ? field.required('請輸入台座尺寸') : field;
      }),
      cardboardBox: yup.boolean(),
      woodBox: yup.boolean(),
    }),
  }),
});

type ArtworksDetailProps = Pick<ArtworksTitleProps, 'type'>;

function ArtworksDetail({ type }: ArtworksDetailProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setPageTitle({
        title: <ArtworksTitle id={params.artworksId} type={type} pageType="detail" />,
      })
    );
  }, [dispatch, params.artworksId, type]);

  const { isLoading, isSuccess, data, isInitialLoading } = useQuery(
    ['data', params.artworksId],
    () => fetchArtworkDetailByDisplayId(params.artworksId || ''),
    {
      enabled: !!params.artworksId, // only run the query if the id exists
    }
  );

  const mutation = useMutation({
    mutationFn: (data: ArtworkDetail) => createOrUpdateArtworkDetail(data),
    onSuccess: async () => {
      await showSuccess(params.artworksId ? '更新成功！' : '新增成功！');
      navigate({
        pathname: '../',
        search: searchParams.toString(),
      });
    },
    onError: async () => {
      await showError(params.artworksId ? '替新失敗！' : '新墥失敗！');
    },
  });

  const [previewImage, setPreviewImage] = useState<string>();
  const {
    control,
    reset,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
  } = useForm<ArtworkDetail>({
    defaultValues: {
      warehouseId: null,
      zhName: '',
      enName: '',
      imageUrl: '',
      thumbnailUrl: '',
      countryCode: '',
      status: 'Draft',
      artists: [{ enName: '', zhName: '' }],
      yearRangeStart: null,
      yearRangeEnd: null,
      metadata: {
        artworkType: '',
        assetsType: '',
        agentGalleries: [],
        purchasingUnit: '',
        length: '',
        width: '',
        height: '',
        customSize: '',
        serialNumber: '',
        media: '',
        edition: '',
        otherInfo: {
          frame: false,
          frameDimensions: '',
          pedestal: false,
          pedestalDimensions: '',
          cardboardBox: false,
          woodenBox: false,
        },
        warehouseLocation: '',
        storeType: 'none',
      },
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
    name: 'artists',
  });

  const {
    fields: agentGalleryFields,
    append: appendAgentGalleries,
    remove: removeAgentGalleries,
  } = useFieldArray({
    control,
    name: 'metadata.agentGalleries',
  });

  const uploadImageMutation = useMutation({
    mutationFn: (file: File) => uploadImageToS3(file),
    onMutate: (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPreviewImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    },
    onSuccess: (data) => {
      setValue('imageUrl', data.displayUrl);
      setValue('thumbnailUrl', data.thumbnailUrl);
      trigger('imageUrl');
    },
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0);
    if (file) {
      uploadImageMutation.mutate(file);
    }
  };

  const onSubmit = (data: ArtworkDetail) => {
    mutation.mutate(data);
  };

  if (isInitialLoading && isLoading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-base-100 p-4 flex flex-col gap-5 rounded-md shadow-md">
            <div className="flex gap-3">
              <button className="btn btn-outline">庫存資訊</button>
              <button className="btn btn-outline">銷售資訊</button>
            </div>

            <label className="font-bold">作品圖片</label>
            <div className="relative">
              <input
                type="file"
                className={classNames('file-input file-input-bordered max-w-xs', {
                  'border-error': errors.imageUrl?.message,
                })}
                onChange={handleFileChange}
              />
              {errors.imageUrl && <p className="absolute text-error text-xs italic bottom-0 translate-y-full">{errors.imageUrl.message}</p>}
            </div>

            {(watch('imageUrl') || previewImage) && <img src={watch('imageUrl') || previewImage} className="w-full" alt="作品圖片" />}

            <label className="font-bold">藝術家</label>
            <div className="flex flex-wrap gap-4">
              {artworkNameFields.map((field, index) => (
                <div className="form-control relative" key={field.id}>
                  <div className="input-group border rounded-lg border-base-200 ">
                    <div className="bg-base-200 p-1 flex items-center gap-1 flex-wrap">
                      <input
                        className={classNames('input text-center flex-1 rounded-r-none', {
                          'border-error': errors.artists?.at?.(index)?.message && watch(`artists.${index}.zhName`)?.trim() === '',
                        })}
                        placeholder="中文名稱"
                        {...register(`artists.${index}.zhName`, {
                          onChange: () => trigger('artists'),
                        })}
                      />
                      <input
                        className={classNames('input text-center flex-1 rounded-l-none', {
                          'border-error': errors.artists?.at?.(index)?.message && watch(`artists.${index}.enName`)?.trim() === '',
                        })}
                        placeholder="英文名稱"
                        {...register(`artists.${index}.enName`, {
                          onChange: () => trigger('artists'),
                        })}
                      />
                      {errors.artists?.at?.(index) && (
                        <p className="absolute text-error text-xs italic bottom-0 translate-y-full">
                          {errors.artists?.at?.(index)?.message}
                        </p>
                      )}
                    </div>
                    {artworkNameFields.length > 1 && (
                      <button type="button" className="btn h-full" onClick={() => removeArtworkNames(index)}>
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <button type="button" className="btn btn-accent mt-1" onClick={() => appendArtworkNames({ zhName: '', enName: '' })}>
                <PlusIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="bg-base-100 p-4 flex flex-col gap-5 rounded-md shadow-md">
            <div className="flex flex-col gap-2 pb-2">
              <label className="font-bold">資產類別</label>
              <div className="relative">
                <select
                  className={classNames('select select-bordered text-lg w-full max-w-xs', {
                    'select-error': errors.metadata?.assetsType,
                  })}
                  {...register('metadata.assetsType')}
                >
                  <option value="" disabled>
                    請選擇
                  </option>
                  {assetsTypeOptions.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                {errors.metadata?.assetsType && <p className="absolute text-error text-xs italic">{errors.metadata?.assetsType.message}</p>}
              </div>
            </div>

            <div className="flex flex-col gap-2 pb-2">
              <label className="font-bold">作品類型</label>
              <div className="relative">
                <select
                  className={classNames('select select-bordered text-lg w-full max-w-xs', {
                    'select-error': errors.metadata?.artworkType,
                  })}
                  {...register('metadata.artworkType')}
                >
                  <option value="" disabled>
                    請選擇
                  </option>
                  <option value="繪畫">繪畫</option>
                  <option value="雕塑">雕塑</option>
                  <option value="公仔">公仔</option>
                </select>
                {errors.metadata?.artworkType && (
                  <p className="absolute text-error text-xs italic">{errors.metadata?.artworkType.message}</p>
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
                          {...register(`metadata.agentGalleries.${index}.name`)}
                        />
                      </div>
                      <button type="button" className="btn h-full" onClick={() => removeAgentGalleries(index)}>
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}

                <button type="button" className="btn btn-accent mt-1" onClick={() => appendAgentGalleries({ name: '' })}>
                  <PlusIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2 pb-2">
              <label className="font-bold">國籍</label>
              <div className="relative">
                <select
                  className={classNames('select select-bordered text-lg w-full max-w-xs', {
                    'select-error': errors.countryCode,
                  })}
                  {...register('countryCode')}
                >
                  <option value="" disabled>
                    請選擇
                  </option>
                  <option value="TWD">Taiwan</option>
                  <option value="USA">USA</option>
                  <option value="JPN">Japan</option>
                </select>
                {errors.countryCode && <p className="absolute text-error text-xs italic">{errors.countryCode.message}</p>}
              </div>
            </div>
          </div>
          <div className="bg-base-100 p-4 md:col-span-2 divide-y rounded-md shadow-md">
            <div className="flex flex-col gap-5 pb-6">
              <div className="flex items-center gap-2">
                <label className="font-bold">進貨單位</label>
                <div className="relative flex-1">
                  <input
                    className={classNames('input input-bordered w-full max-w-xs', {
                      'input-error': errors.metadata?.purchasingUnit,
                    })}
                    {...register('metadata.purchasingUnit')}
                  />
                  {errors.metadata?.purchasingUnit && (
                    <p className="absolute text-error text-xs italic">{errors.metadata?.purchasingUnit.message}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="font-bold">作品名稱</label>
                <div className="relative flex-1">
                  <input
                    className={classNames('input input-bordered w-full max-w-xs', {
                      'input-error': errors.enName,
                    })}
                    {...register('enName')}
                  />
                  {errors.enName && <p className="absolute text-error text-xs italic">{errors.enName.message}</p>}
                </div>
              </div>

              <div className="flex items-center gap-4 flex-wrap md:flex-no-wrap">
                <label className="font-bold">尺寸</label>
                <div className="flex flex-wrap flex-1 gap-4">
                  <div className="flex gap-2 items-center">
                    <label>長</label>
                    <div className="relative flex-1">
                      <input
                        className={classNames('input input-bordered w-full max-w-xs', {
                          'input-error': errors.metadata?.length,
                        })}
                        {...register('metadata.length')}
                      />
                      {errors.metadata?.length && <p className="absolute text-error text-xs italic">{errors.metadata?.length.message}</p>}
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <label>寬</label>
                    <div className="relative flex-1">
                      <input
                        className={classNames('input input-bordered w-full max-w-xs', {
                          'input-error': errors.metadata?.width,
                        })}
                        {...register('metadata.width')}
                      />
                      {errors.metadata?.width && <p className="absolute text-error text-xs italic">{errors.metadata?.width.message}</p>}
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <label>高</label>
                    <div className="relative flex-1">
                      <input
                        className={classNames('input input-bordered w-full max-w-xs', {
                          'input-error': errors.metadata?.height,
                        })}
                        {...register('metadata.height')}
                      />
                      {errors.metadata?.height && <p className="absolute text-error text-xs italic">{errors.metadata?.height.message}</p>}
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <label className="whitespace-nowrap">自定義尺寸</label>
                    <div className="relative flex-1">
                      <input
                        className={classNames('input input-bordered w-full max-w-xs', {
                          'input-error': errors.metadata?.customSize,
                        })}
                        {...register('metadata.customSize')}
                      />
                      {errors.metadata?.customSize && (
                        <p className="absolute text-error text-xs italic">{errors.metadata?.customSize.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <label className="whitespace-nowrap">號數</label>
                    <div className="relative flex-1">
                      <input
                        className={classNames('input input-bordered w-full max-w-xs', {
                          'input-error': errors.metadata?.serialNumber,
                        })}
                        {...register('metadata.serialNumber')}
                      />
                      {errors.metadata?.serialNumber && (
                        <p className="absolute text-error text-xs italic">{errors.metadata?.serialNumber.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="font-bold">媒材</label>
                <div className="relative flex-1">
                  <input
                    className={classNames('input input-bordered w-full max-w-xs', {
                      'input-error': errors.metadata?.media,
                    })}
                    {...register('metadata.media')}
                  />
                  {errors.metadata?.media && <p className="absolute text-error text-xs italic">{errors.metadata?.media.message}</p>}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="font-bold">年代</label>
                <div className="flex flex-row items-center flex-1">
                  <div className="relative">
                    <input
                      className={classNames('input input-bordered w-28', {
                        'input-error': errors.yearRangeStart,
                      })}
                      {...register('yearRangeStart')}
                    />
                    {errors.yearRangeStart && <p className="absolute text-error text-xs italic">{errors.yearRangeStart.message}</p>}
                  </div>
                  <span className="h-[1px] w-3 bg-base-content mx-2"></span>
                  <div className="relative">
                    <input
                      className={classNames('input input-bordered w-28', {
                        'input-error': errors.yearRangeEnd,
                      })}
                      {...register('yearRangeEnd')}
                    />
                    {errors.yearRangeEnd && <p className="absolute text-error text-xs italic">{errors.yearRangeEnd.message}</p>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="font-bold">版次 ed.</label>
                <div className="relative flex-1">
                  <input
                    className={classNames('input input-bordered w-full max-w-xs', {
                      'input-error': errors.metadata?.edition,
                    })}
                    {...register('metadata.edition')}
                  />
                  {errors.metadata?.edition && <p className="absolute text-error text-xs italic">{errors.metadata?.edition.message}</p>}
                </div>
              </div>

              <div className="flex items-start gap-2 flex-col md:flex-row md:items-center">
                <label className="font-bold">其他資訊</label>
                <div className="flex flex-row flex-1 flex-wrap gap-2">
                  <div className="flex gap-2">
                    <label className="flex items-center gap-2 label-text whitespace-nowrap">
                      <input type="checkbox" className="checkbox checkbox-secondary" {...register('metadata.otherInfo.frame')} />
                      表框，尺寸
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      {...register('metadata.otherInfo.frameDimensions')}
                      disabled={!watch('metadata.otherInfo.frame')}
                    />
                  </div>
                  <div className="flex gap-2">
                    <label className="flex items-center gap-2 label-text">
                      <input type="checkbox" className="checkbox checkbox-secondary" {...register('metadata.otherInfo.pedestal')} />
                      台座，尺寸
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      {...register('metadata.otherInfo.pedestalDimensions')}
                      disabled={!watch('metadata.otherInfo.pedestal')}
                    />
                  </div>
                  <div className="flex gap-2 py-3">
                    <label className="flex items-center gap-2 label-text">
                      <input type="checkbox" className="checkbox checkbox-secondary" {...register('metadata.otherInfo.cardboardBox')} />
                      紙箱
                    </label>
                  </div>
                  <div className="flex gap-2 py-3">
                    <label className="flex items-center gap-2 label-text">
                      <input type="checkbox" className="checkbox checkbox-secondary" {...register('metadata.otherInfo.woodenBox')} />
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
                      {...register('warehouseId', {
                        onChange: (e) => setValue('warehouseId', e.target.value === '' ? null : parseInt(e.target.value, 10)),
                      })}
                    >
                      <option disabled>請選擇</option>
                      <option value={0}>A</option>
                      <option value={1}>B</option>
                      <option value={2}>C</option>
                      <option value={3}>D</option>
                      <option value={4}>E</option>
                    </select>
                    {errors.warehouseId && <p className="absolute text-error text-xs italic">{errors.warehouseId.message}</p>}
                  </div>
                  <input type="text" className="input input-bordered" placeholder="自填位置" {...register('metadata.warehouseLocation')} />
                </div>
              </div>

              <div className="flex items-start gap-2 flex-col md:flex-row md:items-center">
                <label className="font-bold whitespace-nowrap">庫存狀態</label>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="label gap-2">
                    <input type="radio" className="radio radio-secondary" value="lend" {...register('metadata.storeType')} />
                    <span className="label-text">借展，單位</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    disabled={watch('metadata.storeType') !== 'lend'}
                    {...register('metadata.lendDepartment')}
                  />

                  <label className="label gap-2">
                    <input type="radio" className="radio radio-secondary" value="repair" {...register('metadata.storeType')} />
                    <span className="label-text">維修，單位</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    disabled={watch('metadata.storeType') !== 'repair'}
                    {...register('metadata.repairDepartment')}
                  />
                  <label className="label gap-2 pl-0">
                    <span className="label-text">，狀態說明</span>
                    <input
                      type="text"
                      className="input input-bordered"
                      disabled={watch('metadata.storeType') !== 'repair'}
                      {...register('metadata.repairNote')}
                    />
                  </label>

                  <label className="label gap-2">
                    <input
                      type="radio"
                      className="radio radio-secondary"
                      value="returnedLend_or_returnedRepair"
                      {...register('metadata.storeType')}
                    />
                    <span className="label-text">已歸還，單位</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    disabled={watch('metadata.storeType') !== 'returnedLend_or_returnedRepair'}
                    {...register('metadata.returnRepairDepartment')}
                  />

                  <label className="label gap-2">
                    <input type="radio" className="radio radio-secondary" value="shipping" {...register('metadata.storeType')} />
                    <span className="label-text">已出貨</span>
                  </label>

                  <label className="label gap-2">
                    <input type="radio" className="radio radio-secondary" value="returnedShipping" {...register('metadata.storeType')} />
                    <span className="label-text">已退回，單位</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    disabled={watch('metadata.storeType') !== 'returnedShipping'}
                    {...register('metadata.returnedShippingDepartment')}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-5 py-5" style={{ display: 'none' }}>
              <h2 className="text-2xl text-accent font-bold">銷售資訊</h2>

              <div className="flex items-center gap-2">
                <label className="font-bold">購買人</label>
                <span className="input input-bordered flex items-center">這是都是從建立銷售單的帶過來的欄位嗎?</span>
              </div>

              <div className="flex items-center gap-2">
                <label className="font-bold">收件者</label>
                <span className="input input-bordered flex items-center">這是都是從建立銷售單的帶過來的欄位嗎?</span>
              </div>

              <div className="flex items-center gap-2">
                <label className="font-bold">電話</label>
                <span className="input input-bordered flex items-center">這是都是從建立銷售單的帶過來的欄位嗎?</span>
              </div>

              <div className="flex items-center gap-2">
                <label className="font-bold">地址</label>
                <span className="input input-bordered flex items-center">這是都是從建立銷售單的帶過來的欄位嗎?</span>
              </div>

              <div className="flex items-center gap-2">
                <label className="font-bold">售出日期</label>
                <span className="input input-bordered flex items-center">這是都是從建立銷售單的帶過來的欄位嗎?</span>
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

      {mutation.isLoading && (
        <div className="w-full h-screen flex justify-center items-center text-gray-300 dark:text-gray-200 bg-base-100 fixed top-0 left-0 z-10 opacity-40">
          <span className="loading loading-bars loading-lg"></span>
        </div>
      )}
    </>
  );
}

export default ArtworksDetail;
