import React, { useEffect } from 'react';

import { setPageTitle } from 'features/common/headerSlice';
import { useFieldArray, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import * as yup from 'yup';

import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup.object().shape({
  image: yup.string(),
  artistNames: yup.array().of(
    yup
      .object()
      .shape({
        chineseName: yup.string(),
        englishName: yup.string(),
      })
      .test(
        'at-least-one-name',
        '請至少填寫中文名稱或英文名稱',
        (value) => !!value.chineseName || !!value.englishName
      )
  ),

  assetCategory: yup.string().required('資產類別為必填項目'),
  type: yup.string().required('作品類型為必填項目'),
  agentGalleries: yup.array().of(
    yup.object().shape({
      name: yup.string().required('代理畫廊名稱為必填項目'),
    })
  ),
  nationality: yup.string().required('國籍為必填項目'),

  name: yup.string().required('作品名稱為必填項目'),
  length: yup.string().required('請輸入長度'),
  width: yup.string().required('請輸入寬度'),
  height: yup.string().required('請輸入高度'),
  customSize: yup.string().required('請輸入自定義尺寸'),
  serialNumber: yup.string().required('號數為必填項目'),
  media: yup.string().required('媒材為必填項目'),
  year: yup.number(),
  edition: yup.number(),

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
});

function ArtworksDetail() {
  const params = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: `藝術作品 > 庫存 > ${params.artworksId}` }));
  }, [dispatch, params.artworksId]);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      image: '',
      artistNames: [{ chineseName: '', englishName: '' }],

      assetCategory: '',
      type: '',
      agentGalleries: [{ name: '' }],
      nationality: '',

      name: '',
      length: '',
      width: '',
      height: '',
      customSize: '',
      serialNumber: '',
      media: '',
      year: '',
      edition: '',

      otherInfo: {
        frame: false,
        frameDimensions: '',
        pedestal: false,
        pedestalDimensions: '',
        cardboardBox: false,
        woodenBox: false,
      },

      stockLocationId: '',
      stockStatus: {
        id: '',
        unitText: '',
        remark: '',
      },
    },
  });

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

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-base-100 p-4 flex flex-col gap-5">
            <div className="flex gap-3">
              <button className="btn btn-outline">庫存資訊</button>
              <button className="btn btn-outline">銷售資訊</button>
            </div>

            <label>作品圖片</label>
            <input
              type="file"
              className="file-input file-input-bordered file-input-primary max-w-xs"
              {...register('image')}
            />

            <label>藝術家</label>
            <div className="flex flex-wrap gap-2">
              {artworkNameFields.map((field, index) => (
                <div className="form-control" key={field.id}>
                  <div className="input-group border rounded-lg border-base-200">
                    <div className="bg-base-200 p-1 flex items-center gap-2 flex-wrap">
                      <input
                        className="input text-center flex-1"
                        placeholder="中文名稱"
                        {...register(`artistNames.${index}.chineseName`)}
                      />
                      <input
                        className="input text-center flex-1"
                        placeholder="英文名稱"
                        {...register(`artistNames.${index}.englishName`)}
                      />
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary h-full"
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
          <div className="bg-base-100 p-4 flex flex-col gap-5">
            <label>資產類別</label>
            <select
              className="select select-bordered w-full max-w-xs"
              {...register('assetCategory')}
            >
              <option value="" disabled>
                請選擇
              </option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>

            <label>作品類型</label>
            <select
              className="select select-bordered w-full max-w-xs"
              {...register('type')}
            >
              <option value="" disabled>
                請選擇
              </option>
              <option value="繪畫">繪畫</option>
              <option value="雕塑">雕塑</option>
              <option value="公仔">公仔</option>
            </select>

            <label>代理藝廊</label>
            <div className="flex flex-wrap gap-2">
              {agentGalleryFields.map((field, index) => (
                <div className="form-control" key={field.id}>
                  <div className="input-group border rounded-lg border-base-200">
                    <div className="bg-base-200 p-1 flex items-center gap-2 flex-wrap">
                      <input
                        className="input text-center flex-1"
                        placeholder="藝廊名稱"
                        {...register(`agentGalleries.${index}.name`)}
                      />
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary h-full"
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

            <label>國籍</label>
            <select
              className="select select-bordered w-full max-w-xs"
              {...register('nationality')}
            >
              <option value="" disabled>
                請選擇
              </option>
              <option value="Taiwan">Taiwan</option>
              <option value="USA">USA</option>
              <option value="Japan">Japan</option>
            </select>
          </div>
          <div className="bg-base-100 p-4 md:col-span-2 divide-y">
            <div className="flex flex-col gap-4 pb-5">
              <div className="flex gap-2 items-center">
                <label>作品名稱</label>
                <input
                  type="text"
                  className={`input input-bordered w-full max-w-xs ${
                    errors.name && 'input-error'
                  }`}
                  {...register('name')}
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap md:flex-no-wrap">
                <label>尺寸</label>
                <div className="flex-1 grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  <div className="flex gap-2 items-center">
                    <label>長</label>
                    <input
                      type="text"
                      className="input input-bordered w-full max-w-xs"
                      {...register('length')}
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    <label>寬</label>
                    <input
                      type="text"
                      className="input input-bordered w-full max-w-xs"
                      {...register('width')}
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    <label>高</label>
                    <input
                      type="text"
                      className="input input-bordered w-full max-w-xs"
                      {...register('height')}
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    <label>自定義尺寸</label>
                    <input
                      type="text"
                      className="input input-bordered w-full max-w-xs"
                      {...register('customSize')}
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    <label>號數</label>
                    <input
                      type="text"
                      className="input input-bordered w-full max-w-xs"
                      {...register('serialNumber')}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label>媒材</label>
                <input
                  type="text"
                  className="input input-bordered w-full max-w-xs"
                  {...register('media')}
                />
              </div>

              <div className="flex items-center gap-2">
                <label>年代</label>
                <input
                  type="text"
                  className="input input-bordered w-full max-w-xs"
                  {...register('year')}
                />
              </div>

              <div className="flex items-center gap-2">
                <label>版次 ed.</label>
                <input
                  type="text"
                  className="input input-bordered w-full max-w-xs"
                  {...register('edition')}
                />
              </div>

              <div className="flex items-start gap-2 flex-col md:flex-row md:items-center">
                <label>其他資訊</label>
                <div className="flex gap-2">
                  <label className="flex items-center gap-2 label-text">
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
                <div className="flex gap-2">
                  <label className="flex items-center gap-2 label-text">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-secondary"
                      {...register('otherInfo.cardboardBox')}
                    />
                    紙箱
                  </label>
                </div>
                <div className="flex gap-2">
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

            <div className="flex flex-col gap-2 py-5">
              <h2 className="text-2xl text-accent font-bold">庫存資訊</h2>

              <div className="flex flex-wrap items-center gap-2">
                <label className="whitespace-nowrap">在庫位置</label>
                <select
                  className="select select-bordered w-full max-w-xs"
                  {...register('stockLocationId')}
                >
                  <option value="" disabled>
                    請選擇
                  </option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                </select>
              </div>

              <div className="flex items-start gap-2 flex-col md:flex-row md:items-center">
                <label className="whitespace-nowrap">庫存狀態</label>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="label gap-2">
                    <input
                      type="radio"
                      className="radio radio-secondary"
                      value={1}
                      {...register('stockStatus.id')}
                    />
                    <span className="label-text">借展，單位</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    {...register('stockStatus.unitText')}
                  />

                  <label className="label gap-2">
                    <input
                      type="radio"
                      className="radio radio-secondary"
                      value={2}
                      {...register('stockStatus.id')}
                    />
                    <span className="label-text">維修，單位</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    {...register('stockStatus.unitText')}
                  />
                  <label className="label gap-2 pl-0">
                    <span className="label-text">，狀態說明</span>
                    <input
                      type="text"
                      className="input input-bordered"
                      {...register('stockStatus.remark')}
                    />
                  </label>

                  <label className="label gap-2">
                    <input
                      type="radio"
                      className="radio radio-secondary"
                      value={3}
                      {...register('stockStatus.id')}
                    />
                    <span className="label-text">已歸還，單位</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    {...register('stockStatus.unitText')}
                  />

                  <label className="label gap-2">
                    <input
                      type="radio"
                      className="radio radio-secondary"
                      value={4}
                      {...register('stockStatus.id')}
                    />
                    <span className="label-text">已出貨</span>
                  </label>

                  <label className="label gap-2">
                    <input
                      type="radio"
                      className="radio radio-secondary"
                      value={5}
                      {...register('stockStatus.id')}
                    />
                    <span className="label-text">已退回，單位</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    {...register('stockStatus.unitText')}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default ArtworksDetail;
