'use client';

import React, { ChangeEvent, useState } from 'react';

import { StoreType, assetsTypeOptions } from '@constants/artwork.constant';
import {
  createOrUpdateArtworkDetail,
  fetchArtworkDetailByDisplayId,
} from 'data-access/apis/artworks.api';
import { uploadImageToS3 } from 'data-access/apis/files.api';
import { ArtworkDetail, Status } from 'data-access/models';
import { useFieldArray, useForm } from 'react-hook-form';
import { showError, showSuccess } from 'utils/swalUtil';
import * as yup from 'yup';

import { CheckIcon } from '@heroicons/react/20/solid';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from '@tanstack/react-query';

import { fetchCountryList } from '@data-access/apis/countries.api';
import { usefetchPartnerList } from '@data-access/hooks';
import cx from 'classnames';
import { useParams, useRouter } from 'next/navigation';

const salesInfoDisplayed = true;

const scrollToStoreInfo = () => {
  // TODO: use refs to reference DOM elements instead of directly using document.querySelector or document.getElementById.
  document?.querySelector('main')?.scrollTo({
    top: document?.getElementById('store-information')?.getBoundingClientRect().top,
    behavior: 'smooth',
  });
};

const scrollToSalesInfo = () => {
  // TODO: use refs to reference DOM elements instead of directly using document.querySelector or document.getElementById.
  document?.querySelector('main')?.scrollTo({
    top: document?.getElementById('sales-information')?.getBoundingClientRect().top,
    behavior: 'smooth',
  });
};

const schema = yup.object().shape({
  enName: yup.string().test('artwork name', '作品名稱為必填項目', (value, context) => {
    return value || context.parent?.zhName ? true : false;
  }),
  zhName: yup.string().test('artwork name', '作品名稱為必填項目', (value, context) => {
    return value || context.parent?.enName ? true : false;
  }),
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
      }),
  ),
  yearAge: yup.string().required('年代為必填項目'),
  metadata: yup.object().shape({
    artworkType: yup.string().required('作品類型為必填項目'),
    assetsType: yup.string().required('資產類別為必填項目'),
    media: yup.string().test('media name', '媒材為必填項目', (value, context) => {
      return value || context.parent?.zhMedia ? true : false;
    }),
    zhMedia: yup.string().test('media name', '媒材為必填項目', (value, context) => {
      return value || context.parent?.media ? true : false;
    }),
    edition: yup.string(),
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

const ArtworksDetail = ({ status }: { status: Status }): JSX.Element => {
  const router = useRouter();
  const params = useParams<{ id?: string }>();

  const { isLoading, isSuccess, data, isInitialLoading } = useQuery(
    ['data', params.id],
    () => fetchArtworkDetailByDisplayId(params.id!),
    {
      enabled: !!params.id, // only run the query if the id exists
    },
  );

  const { data: countryList } = useQuery(['fetchCountryList'], () => fetchCountryList(), {
    keepPreviousData: true,
  });

  const { data: artistList } = usefetchPartnerList({ type: 'Artist', pageSize: 100000 });
  const { data: companyList } = usefetchPartnerList({ type: 'Company', pageSize: 100000 });

  const mutation = useMutation({
    mutationFn: (data: ArtworkDetail) => createOrUpdateArtworkDetail(data),
    onSuccess: async () => {
      await showSuccess(params.id ? '更新成功！' : '新增成功！');
      router.back();
    },
    onError: async () => {
      await showError(params.id ? '替新失敗！' : '新墥失敗！');
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
      zhName: '',
      enName: '',
      imageUrl: '',
      thumbnailUrl: '',
      countryCode: '',
      status,
      artists: [{ enName: '', zhName: '' }],
      yearAge: null,
      metadata: {
        artworkType: '',
        assetsType: 'A',
        agentGalleries: [{ name: '' }],
        purchasingUnit: '',
        length: '',
        width: '',
        height: '',
        customSize: '',
        serialNumber: '',
        media: '',
        zhMedia: '',
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
        storeType:
          status === Status.Draft
            ? undefined
            : Status.Disabled
              ? StoreType.NONE
              : StoreType.IN_STOCK,
      },
    },
    resolver: yupResolver<any>(schema),
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
    if (
      data.metadata?.salesName ||
      data.metadata?.salesPhone ||
      data.metadata?.salesAddress ||
      data.metadata?.salesDate ||
      data.metadata?.storeType === StoreType.SHIPPING
    ) {
      data.metadata.salesType = 'sold';
    }

    if (data.metadata?.storeType === StoreType.NONE) data.status = Status.Disabled;
    if (data.metadata?.storeType === StoreType.IN_STOCK) data.status = Status.Enabled;

    if (data.metadata && data.metadata.storeType !== StoreType.IN_STOCK) {
      data.warehouseId = -1;
      data.metadata.warehouseLocation = '';
    }

    mutation.mutate(data);
  };

  if (isInitialLoading && isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="bg-base-100 flex flex-col gap-5 rounded-md p-4 shadow-md">
            <div className="flex gap-3">
              <button className="btn btn-outline" type="button" onClick={scrollToStoreInfo}>
                庫存資訊
              </button>
              {salesInfoDisplayed && (
                <button className="btn btn-outline" type="button" onClick={scrollToSalesInfo}>
                  銷售資訊
                </button>
              )}
            </div>

            <label className="font-bold" role="label">
              作品圖片
            </label>
            <div className="flex items-center justify-between">
              <div className="relative">
                <input
                  type="file"
                  className={cx('file-input file-input-bordered max-w-xs', {
                    'border-error': errors.imageUrl?.message,
                  })}
                  onChange={handleFileChange}
                />
                {errors.imageUrl && (
                  <p className="text-error absolute bottom-0 translate-y-full text-xs italic">
                    {errors.imageUrl.message}
                  </p>
                )}
              </div>
              {watch('imageUrl') && (
                <div className="text-right">
                  <a
                    href={watch('imageUrl')}
                    className="text-primary text-lg"
                    target="blank"
                    rel="noreferrer"
                  >
                    另開原圖
                  </a>
                  <p className="text-error text-sm">圖片載入過慢，請先另開原圖 🙏</p>
                </div>
              )}
            </div>

            {(watch('thumbnailUrl') || previewImage) && (
              <img src={watch('thumbnailUrl') || previewImage} className="w-full" alt="作品圖片" />
            )}

            <label className="font-bold" role="label">
              藝術家
            </label>
            <div className="flex flex-wrap gap-4">
              {artworkNameFields.map((field, index) => (
                <div className="form-control relative" key={field.id}>
                  <div className="input-group border-base-200 rounded-lg border ">
                    <div className="bg-base-200 flex flex-wrap items-center gap-1 p-1">
                      <div>
                        <select
                          className={cx('select select-bordered w-full max-w-xs text-lg', {
                            'select-error': errors.artists,
                          })}
                          {...register(`artists.${index}.zhName`, {
                            onChange: () => trigger('artists'),
                          })}
                        >
                          <option value="" disabled>
                            請選擇中文名稱
                          </option>
                          {artistList?.data
                            .filter((item) => item.zhName)
                            .map((item) => (
                              <option
                                key={`artist__option-${item.id}`}
                                data-testid={`artist__option-${item.id}`}
                                value={item.zhName}
                              >
                                {item.zhName}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div>
                        <select
                          className={cx('select select-bordered w-full max-w-xs text-lg', {
                            'select-error': errors.artists,
                          })}
                          {...register(`artists.${index}.enName`, {
                            onChange: () => trigger('artists'),
                          })}
                        >
                          <option value="" disabled>
                            請選擇英文名稱
                          </option>
                          {artistList?.data
                            .filter((item) => item.enName)
                            .map((item) => (
                              <option
                                key={`artist__option-${item.id}`}
                                data-testid={`artist__option-${item.id}`}
                                value={item.enName}
                              >
                                {item.enName}
                              </option>
                            ))}
                        </select>
                      </div>
                      {errors.artists?.at?.(index) && (
                        <p className="text-error absolute bottom-0 translate-y-full text-xs italic">
                          {errors.artists?.at?.(index)?.message}
                        </p>
                      )}
                    </div>
                    {artworkNameFields.length > 1 && (
                      <button
                        type="button"
                        className="btn h-full"
                        onClick={() => removeArtworkNames(index)}
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <button
                type="button"
                className="btn btn-accent mt-1"
                onClick={() => appendArtworkNames({ zhName: '', enName: '' })}
              >
                <PlusIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="bg-base-100 flex flex-col gap-5 rounded-md p-4 shadow-md">
            <div className="flex flex-col gap-2 pb-2">
              <label className="font-bold" role="label">
                資產類別
              </label>
              <div className="relative">
                <select
                  className={cx('select select-bordered w-full max-w-xs text-lg', {
                    'select-error': errors.metadata?.assetsType,
                  })}
                  data-testid="assetsType"
                  {...register('metadata.assetsType')}
                >
                  <option value="" disabled>
                    請選擇
                  </option>
                  {assetsTypeOptions.map(({ value, label }) => (
                    <option
                      key={`assetsType__option-${value}`}
                      data-testid={`assetsType__option-${value}`}
                      value={value}
                    >
                      {label}
                    </option>
                  ))}
                </select>
                {errors.metadata?.assetsType && (
                  <p className="text-error absolute text-xs italic">
                    {errors.metadata?.assetsType.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 pb-2">
              <label className="font-bold" role="label">
                作品類型
              </label>
              <div className="relative">
                <select
                  className={cx('select select-bordered w-full max-w-xs text-lg', {
                    'select-error': errors.metadata?.artworkType,
                  })}
                  {...register('metadata.artworkType')}
                >
                  <option value="" disabled>
                    請選擇
                  </option>
                  <option value="攝影">攝影</option>
                  <option value="版畫">版畫</option>
                  <option value="裝置作品">裝置作品</option>
                  <option value="繪畫">繪畫</option>
                  <option value="雕塑">雕塑</option>
                  <option value="公仔">公仔</option>
                </select>
                {errors.metadata?.artworkType && (
                  <p className="text-error absolute text-xs italic">
                    {errors.metadata?.artworkType.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 pb-2">
              <label className="font-bold" role="label">
                代理藝廊
              </label>
              <div className="flex flex-wrap gap-2">
                {agentGalleryFields.map((field, index) => (
                  <div className="form-control" key={field.id}>
                    <div className="input-group border-base-200 rounded-lg border">
                      <div className="bg-base-200 flex flex-wrap items-center gap-2 p-1">
                        <select
                          className={cx('select select-bordered w-full max-w-xs text-lg')}
                          {...register(`metadata.agentGalleries.${index}.name`)}
                        >
                          <option value="" disabled>
                            請選擇
                          </option>
                          {companyList?.data.map((item) => (
                            <option
                              key={`company__option-${item.id}`}
                              data-testid={`company__option-${item.id}`}
                              value={item.zhName}
                            >
                              {item.zhName}
                            </option>
                          ))}
                        </select>
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
              <label className="font-bold" role="label">
                國籍
              </label>
              <div className="relative">
                <select
                  className={cx('select select-bordered w-full max-w-xs text-lg', {
                    'select-error': errors.countryCode,
                  })}
                  data-testid="countryCode"
                  {...register('countryCode')}
                >
                  <option value="" disabled>
                    請選擇
                  </option>
                  {countryList?.map((item) => (
                    <option key={item.alpha3Code} value={item.alpha3Code}>
                      {item.zhName}
                    </option>
                  ))}
                </select>
                {errors.countryCode && (
                  <p className="text-error absolute text-xs italic">{errors.countryCode.message}</p>
                )}
              </div>
            </div>
          </div>
          <div className="bg-base-100 divide-y rounded-md p-4 shadow-md md:col-span-2">
            <div className="flex flex-col gap-5 pb-6">
              <div className="flex items-center gap-2">
                <label className="font-bold" role="label">
                  進貨單位
                </label>
                <div className="relative flex-1 p-1">
                  <input
                    className={cx('input input-bordered w-full max-w-xs', {
                      'input-error': errors.metadata?.purchasingUnit,
                    })}
                    data-testid="purchasingUnit"
                    {...register('metadata.purchasingUnit')}
                  />
                  {errors.metadata?.purchasingUnit && (
                    <p className="text-error absolute text-xs italic">
                      {errors.metadata?.purchasingUnit.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="md:flex-no-wrap flex flex-wrap items-center gap-2">
                <label className="font-bold">作品名稱</label>
                <div className="relative flex-1">
                  <div className="flex flex-wrap items-center gap-1 p-1">
                    <input
                      className={cx('input input-bordered w-full max-w-xs', {
                        'input-error': errors.zhName,
                      })}
                      placeholder="中文名稱"
                      {...register('zhName', { onChange: () => trigger(['enName', 'zhName']) })}
                    />
                    <input
                      className={cx('input input-bordered w-full max-w-xs', {
                        'input-error': errors.enName,
                      })}
                      placeholder="英文名稱"
                      {...register('enName', { onChange: () => trigger(['enName', 'zhName']) })}
                    />
                  </div>
                  {errors.zhName ? (
                    <p className="text-error absolute text-xs italic">{errors.zhName.message}</p>
                  ) : errors.enName ? (
                    <p className="text-error absolute text-xs italic">{errors.enName.message}</p>
                  ) : (
                    <></>
                  )}
                </div>
              </div>

              <div className="md:flex-no-wrap flex flex-wrap items-center gap-2">
                <label className="font-bold" role="label">
                  尺寸
                </label>
                <div className="flex flex-1 flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <label>長</label>
                    <div className="relative flex-1">
                      <input
                        className={cx('input input-bordered w-full max-w-xs', {
                          'input-error': errors.metadata?.length,
                        })}
                        data-testid="length"
                        {...register('metadata.length')}
                      />
                      {errors.metadata?.length && (
                        <p className="text-error absolute text-xs italic" data-testid="lengthError">
                          {errors.metadata?.length.message}
                        </p>
                      )}
                    </div>
                    <label>cm</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <label>寬</label>
                    <div className="relative flex-1">
                      <input
                        className={cx('input input-bordered w-full max-w-xs', {
                          'input-error': errors.metadata?.width,
                        })}
                        data-testid="width"
                        {...register('metadata.width')}
                      />
                      {errors.metadata?.width && (
                        <p className="text-error absolute text-xs italic" data-testid="widthError">
                          {errors.metadata?.width.message}
                        </p>
                      )}
                    </div>
                    <label>cm</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <label>高</label>
                    <div className="relative flex-1">
                      <input
                        className={cx('input input-bordered w-full max-w-xs', {
                          'input-error': errors.metadata?.height,
                        })}
                        data-testid="height"
                        {...register('metadata.height')}
                      />
                      {errors.metadata?.height && (
                        <p className="text-error absolute text-xs italic" data-testid="heightError">
                          {errors.metadata?.height.message}
                        </p>
                      )}
                    </div>
                    <label>cm</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="whitespace-nowrap">自定義尺寸</label>
                    <div className="relative flex-1">
                      <input
                        className={cx('input input-bordered w-full max-w-xs', {
                          'input-error': errors.metadata?.customSize,
                        })}
                        data-testid="customSize"
                        {...register('metadata.customSize')}
                      />
                      {errors.metadata?.customSize && (
                        <p
                          className="text-error absolute text-xs italic"
                          data-testid="customSizeError"
                        >
                          {errors.metadata?.customSize.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="whitespace-nowrap">號數</label>
                    <div className="relative flex-1">
                      <input
                        className={cx('input input-bordered w-full max-w-xs', {
                          'input-error': errors.metadata?.serialNumber,
                        })}
                        data-testid="serialNumber"
                        {...register('metadata.serialNumber')}
                      />
                      {errors.metadata?.serialNumber && (
                        <p
                          className="text-error absolute text-xs italic"
                          data-testid="serialNumberError"
                        >
                          {errors.metadata?.serialNumber.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:flex-no-wrap flex flex-wrap items-center gap-2">
                <label className="font-bold">媒材</label>
                <div className="relative flex-1">
                  <div className="flex flex-wrap items-center gap-1 p-1">
                    <input
                      className={cx('input input-bordered w-full max-w-xs', {
                        'input-error': errors.metadata?.zhMedia,
                      })}
                      placeholder="中文名稱"
                      {...register('metadata.zhMedia', {
                        onChange: () => trigger(['metadata.media', 'metadata.zhMedia']),
                      })}
                    />
                    <input
                      className={cx('input input-bordered w-full max-w-xs', {
                        'input-error': errors.metadata?.media,
                      })}
                      placeholder="英文名稱"
                      {...register('metadata.media', {
                        onChange: () => trigger(['metadata.media', 'metadata.zhMedia']),
                      })}
                    />
                  </div>
                  {errors.metadata?.zhMedia ? (
                    <p className="text-error absolute text-xs italic">
                      {errors.metadata?.zhMedia.message}
                    </p>
                  ) : errors.metadata?.media ? (
                    <p className="text-error absolute text-xs italic">
                      {errors.metadata?.media.message}
                    </p>
                  ) : (
                    <></>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="font-bold">年代</label>
                <div className="relative flex-1 p-1">
                  <input
                    className={cx('input input-bordered w-full max-w-xs', {
                      'input-error': errors.yearAge,
                    })}
                    data-testid="yearAge"
                    {...register('yearAge')}
                  />
                  {errors.yearAge && (
                    <p className="text-error absolute text-xs italic">{errors.yearAge.message}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="font-bold" role="label">
                  版次 ed.
                </label>
                <div className="relative flex-1">
                  <input
                    className={cx('input input-bordered w-full max-w-xs', {
                      'input-error': errors.metadata?.edition,
                    })}
                    data-testid="edition"
                    {...register('metadata.edition')}
                  />
                  {errors.metadata?.edition && (
                    <p className="text-error absolute text-xs italic" data-testid="editionError">
                      {errors.metadata?.edition.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-start gap-2 md:flex-row md:items-center">
                <label className="font-bold" role="label">
                  其他資訊
                </label>
                <div className="flex flex-1 flex-row flex-wrap gap-2">
                  <div className="flex gap-2">
                    <label className="label-text flex items-center gap-2 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-secondary"
                        {...register('metadata.otherInfo.frame')}
                      />
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
                    <label className="label-text flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-secondary"
                        {...register('metadata.otherInfo.pedestal')}
                      />
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
                    <label className="label-text flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-secondary"
                        {...register('metadata.otherInfo.cardboardBox')}
                      />
                      紙箱
                    </label>
                  </div>
                  <div className="flex gap-2 py-3">
                    <label className="label-text flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-secondary"
                        {...register('metadata.otherInfo.woodenBox')}
                      />
                      木箱
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-5 py-5">
              <h2 id="store-information" className="text-accent text-2xl font-bold">
                庫存資訊
              </h2>

              <div className="flex flex-wrap items-center gap-2">
                <label className="font-bold">在庫位置</label>
                <div className="flex flex-row gap-2">
                  <div className="relative">
                    <select
                      className={cx('select select-bordered text-lg', {
                        'select-error': errors.warehouseId,
                      })}
                      data-testid="warehouseId"
                      {...register('warehouseId', {
                        onChange: (e) =>
                          setValue(
                            'warehouseId',
                            e.target.value === '' ? undefined : parseInt(e.target.value, 10),
                          ),
                      })}
                    >
                      <option value={-1}>請選擇</option>
                      <option value={0}>A</option>
                      <option value={1}>B</option>
                      <option value={2}>C</option>
                      <option value={3}>D</option>
                      <option value={4}>E</option>
                    </select>
                    {errors.warehouseId && (
                      <p className="text-error absolute text-xs italic">
                        {errors.warehouseId.message}
                      </p>
                    )}
                  </div>
                  <input
                    type="text"
                    className="input input-bordered"
                    placeholder="自填位置"
                    {...register('metadata.warehouseLocation')}
                  />
                </div>
              </div>

              <div className="flex flex-col items-start gap-2 md:flex-row md:items-center">
                <label className="whitespace-nowrap font-bold" role="label">
                  庫存狀態
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="label gap-2">
                    <input
                      type="radio"
                      className="radio radio-secondary"
                      value={StoreType.IN_STOCK}
                      {...register('metadata.storeType')}
                    />
                    <span className="label-text">在庫</span>
                  </label>

                  <label className="label gap-2">
                    <input
                      type="radio"
                      className="radio radio-secondary"
                      value={StoreType.LEND}
                      {...register('metadata.storeType')}
                    />
                    <span className="label-text">借展，單位</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    disabled={watch('metadata.storeType') !== StoreType.LEND}
                    {...register('metadata.lendDepartment')}
                  />

                  <label className="label gap-2">
                    <input
                      type="radio"
                      className="radio radio-secondary"
                      value={StoreType.REPAIR}
                      {...register('metadata.storeType')}
                    />
                    <span className="label-text">維修，單位</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    disabled={watch('metadata.storeType') !== StoreType.REPAIR}
                    {...register('metadata.repairDepartment')}
                  />
                  <label className="label gap-2 pl-0">
                    <span className="label-text">，狀態說明</span>
                    <input
                      type="text"
                      className="input input-bordered"
                      disabled={watch('metadata.storeType') !== StoreType.REPAIR}
                      {...register('metadata.repairNote')}
                    />
                  </label>

                  <label className="label gap-2">
                    <input
                      type="radio"
                      className="radio radio-secondary"
                      value={StoreType.RETURNED_LEND_OR_RETURNED_REPAIR}
                      {...register('metadata.storeType')}
                    />
                    <span className="label-text">已歸還，單位</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    disabled={
                      watch('metadata.storeType') !== StoreType.RETURNED_LEND_OR_RETURNED_REPAIR
                    }
                    {...register('metadata.returnRepairDepartment')}
                  />

                  <label className="label gap-2">
                    <input
                      type="radio"
                      className="radio radio-secondary"
                      value={StoreType.SHIPPING}
                      {...register('metadata.storeType')}
                    />
                    <span className="label-text">已出貨</span>
                  </label>

                  <label className="label gap-2">
                    <input
                      type="radio"
                      className="radio radio-secondary"
                      value={StoreType.RETURNED_SHIPPING}
                      {...register('metadata.storeType')}
                    />
                    <span className="label-text">已退回，單位</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    disabled={watch('metadata.storeType') !== StoreType.RETURNED_SHIPPING}
                    {...register('metadata.returnedShippingDepartment')}
                  />

                  <label className="label gap-2">
                    <input
                      type="radio"
                      className="radio radio-secondary"
                      value={StoreType.NONE}
                      {...register('metadata.storeType')}
                    />
                    <span className="label-text">非庫存</span>
                  </label>
                </div>
              </div>
            </div>

            {/* TODO: 藝術品明細頁，需要從相關銷售單，來帶入這些欄位嗎?  */}
            {salesInfoDisplayed && (
              <div className="flex flex-col gap-5 py-5">
                <h2 id="sales-information" className="text-accent text-2xl font-bold">
                  銷售資訊
                </h2>

                <div className="flex items-center gap-2">
                  <label className="font-bold" role="label">
                    購買人
                  </label>
                  <div className="relative flex-1">
                    <input
                      className={cx('input input-bordered w-full max-w-xs', {
                        'input-error': errors.metadata?.salesName,
                      })}
                      data-testid="salesName"
                      {...register('metadata.salesName')}
                    />
                    {errors.metadata?.salesName && (
                      <p className="text-error absolute text-xs italic">
                        {errors.metadata?.salesName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="font-bold" role="label">
                    收件者
                  </label>
                  <div className="relative flex-1">
                    <input
                      className={cx('input input-bordered w-full max-w-xs', {
                        'input-error': errors.metadata?.salseReciver,
                      })}
                      data-testid="salseReciver"
                      {...register('metadata.salseReciver')}
                    />
                    {errors.metadata?.salseReciver && (
                      <p className="text-error absolute text-xs italic">
                        {errors.metadata?.salseReciver.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="font-bold" role="label">
                    電話
                  </label>
                  <div className="relative flex-1">
                    <input
                      className={cx('input input-bordered w-full max-w-xs', {
                        'input-error': errors.metadata?.salesPhone,
                      })}
                      data-testid="salesPhone"
                      {...register('metadata.salesPhone')}
                    />
                    {errors.metadata?.salesPhone && (
                      <p className="text-error absolute text-xs italic">
                        {errors.metadata?.salesPhone.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="font-bold" role="label">
                    地址
                  </label>
                  <div className="relative flex-1">
                    <input
                      className={cx('input input-bordered w-full max-w-xs', {
                        'input-error': errors.metadata?.salesAddress,
                      })}
                      data-testid="salesAddress"
                      {...register('metadata.salesAddress')}
                    />
                    {errors.metadata?.salesAddress && (
                      <p className="text-error absolute text-xs italic">
                        {errors.metadata?.salesAddress.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="font-bold" role="label">
                    售出日期
                  </label>
                  <div className="relative flex-1">
                    <input
                      className={cx('input input-bordered w-full max-w-xs', {
                        'input-error': errors.metadata?.salesDate,
                      })}
                      data-testid="salesDate"
                      {...register('metadata.salesDate')}
                    />
                    {errors.metadata?.salesDate && (
                      <p className="text-error absolute text-xs italic">
                        {errors.metadata?.salesDate.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-base-100 rounded-md p-4 shadow-md md:col-span-2">
            <div className="flex justify-center gap-2">
              <button className="btn btn-success" data-testid="submitButton">
                <CheckIcon className="w-4"></CheckIcon> 儲存
              </button>
              <button
                className="btn btn-error btn-base-200"
                data-testid="cancelButton"
                type="button"
                onClick={() => router.back()}
              >
                <XMarkIcon className="w-4"></XMarkIcon> 取消
              </button>
            </div>
          </div>
        </div>
      </form>

      {mutation.isLoading && (
        <div className="bg-base-100 fixed top-0 left-0 z-10 flex h-screen w-full items-center justify-center text-gray-300 opacity-40 dark:text-gray-200">
          <span className="loading loading-bars loading-lg"></span>
        </div>
      )}
    </>
  );
};

export default ArtworksDetail;
