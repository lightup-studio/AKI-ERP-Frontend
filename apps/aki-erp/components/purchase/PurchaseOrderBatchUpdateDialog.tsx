'use client';

import { useEffect } from 'react';

import { ArtworkDetail } from '@data-access/models';
import { CheckIcon, XMarkIcon } from '@heroicons/react/20/solid';
import classnames from 'classnames';
import PurchaseOrderArtworkTable from './PurchaseOrderArtworkTable';

interface PurchaseOrderList {
  id: number;
  artworks?: ArtworkDetail[];
}

interface PurchaseOrderBatchUpdateDialogProsp {
  list: PurchaseOrderList[];
  isOpen: boolean;
  onClose?: () => void;
}

const PurchaseOrderBatchUpdateDialog: React.FC<PurchaseOrderBatchUpdateDialogProsp> = ({
  list,
  isOpen = false,
  onClose,
}) => {
  useEffect(() => {
    const mainElement = document.querySelector('main');
    if (!mainElement) return;
    mainElement.scrollTo(0, 0);
    mainElement.style.overflow = isOpen ? 'hidden' : 'auto';

    return () => {
      mainElement.style.overflow = 'auto';
    };
  }, [isOpen]);

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
                    進貨單 {item.id}
                  </h4>
                  <div className="overflow-x-auto">
                    <PurchaseOrderArtworkTable data={item.artworks} />
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-base-100 mb-4 md:col-span-2 flex gap-2 justify-center">
          <button className="btn btn-success">
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

export default PurchaseOrderBatchUpdateDialog;
