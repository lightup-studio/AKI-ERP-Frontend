'use client';

import { useEffect } from 'react';

import PageTitle from '@components/shared/PageTitle';
import { patchArtwork } from '@data-access/apis';
import { ArtworkDetail, TransferOrder } from '@data-access/models';
import { CheckIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { useMutation } from '@tanstack/react-query';
import classnames from 'classnames';
import { useForm } from 'react-hook-form';
import ArtworksBatchUpdateTable from './ArtworksBatchUpdateTable';

type FormData = {
  artworks: ArtworkDetail[];
};

interface ArtworksBatchUpdateDialogProsp {
  list: Pick<TransferOrder, 'id' | 'artworks'>[];
  isOpen: boolean;
  onClose?: () => void;
}

const ArtworksBatchUpdateDialog: React.FC<ArtworksBatchUpdateDialogProsp> = ({
  list,
  isOpen = false,
  onClose,
}) => {
  const { register, handleSubmit } = useForm<FormData>();

  const mutation = useMutation((artworks: ArtworkDetail[]) => {
    return Promise.all(
      artworks.map((artwork) =>
        patchArtwork(artwork.id, {
          warehouseId: Number(artwork.warehouseId),
          metadata: artwork.metadata,
        })
      )
    );
  });

  useEffect(() => {
    const mainElement = document.querySelector('main');
    if (!mainElement) return;
    mainElement.scrollTo(0, 0);
    mainElement.style.overflow = isOpen ? 'hidden' : 'auto';

    return () => {
      mainElement.style.overflow = 'auto';
    };
  }, [isOpen]);

  const onSubmit = async (formData: FormData) => {
    await mutation.mutateAsync(formData.artworks);
  };

  return (
    <div
      className={classnames('modal absolute z-10', {
        'modal-open': isOpen,
      })}
    >
      <div className="modal-box max-w-none overflow-hidden flex flex-col p-0">
        <div className="font-bold m-4 pb-2 mb-0 text-2xl border-b-base-content border-b flex justify-between items-baseline">
          <h3>Batch Update Store Info</h3>
        </div>

        <div className="my-3 mr-2 px-4 min-h-[60vh] overflow-y-auto">
          <div className="relative flex flex-col gap-2">
            {list
              .filter((item) => item.artworks?.length)
              .map((item) => (
                <div key={item.id}>
                  <h4 className="font-bold text-xl sticky top-0 bg-base-content text-base-200 z-10 p-2 rounded-lg">
                    <PageTitle /> {item.id}
                  </h4>
                  <div className="overflow-x-auto">
                    <ArtworksBatchUpdateTable data={item.artworks} register={register} />
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-base-100 mb-4 md:col-span-2 flex gap-2 justify-center">
          <button className="btn btn-success" onClick={handleSubmit(onSubmit)}>
            <CheckIcon className="w-4"></CheckIcon> 儲存
          </button>
          <button className="btn btn-error btn-base-200" type="button" onClick={onClose}>
            <XMarkIcon className="w-4"></XMarkIcon> 取消
          </button>
        </div>
      </div>

      <label className="modal-backdrop" onClick={onClose}>
        Close
      </label>
    </div>
  );
};

export default ArtworksBatchUpdateDialog;
