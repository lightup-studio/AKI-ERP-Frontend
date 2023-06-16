import React, { useEffect } from 'react';

import classnames from 'classnames';
import { CheckIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { Button, Dialog, DialogTrigger, Popover } from 'react-aria-components';

function UpdateRangeStoreInfoDialog({
  isOpen = false,
  onClose,
}: {
  isOpen: boolean;
  onClose?: () => void;
}) {
  useEffect(() => {
    const mainElement = document.querySelector('main');
    if (!mainElement) {
      return;
    }
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
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((orderNumber) => (
              <div key={orderNumber}>
                <h4 className="font-bold text-xl sticky top-0 bg-base-content text-base-200 z-10 p-2 rounded-lg">
                  進貨單 {orderNumber}
                </h4>
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr className="text-sm">
                        <th>作品名稱</th>
                        <th>作品圖</th>
                        <th>在庫位置</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="text-sm">
                        <td>Cy Ganderton</td>
                        <td>
                          <DialogTrigger>
                            <Button>
                              <img
                                src="https://cdn.galleryaki.com/shared_87a95945-8442-4e62-8444-c30b66744e8a"
                                alt="Artwork"
                                loading="lazy"
                                className="h-20"
                              />
                            </Button>
                            <Popover placement="right">
                              <Dialog className="h-[80vh]">
                                <img
                                  src="https://cdn.galleryaki.com/shared_87a95945-8442-4e62-8444-c30b66744e8a"
                                  alt="Artwork"
                                  className="w-full h-full object-contain"
                                  loading="lazy"
                                />
                              </Dialog>
                            </Popover>
                          </DialogTrigger>
                        </td>
                        <td>
                          <select className="select select-bordered">
                            <option>A</option>
                            <option>B</option>
                            <option>C</option>
                            <option>D</option>
                            <option>E</option>
                          </select>
                          <input
                            type="text"
                            className="input input-bordered ml-2"
                            placeholder="自填位置"
                          ></input>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-base-100 mb-4 md:col-span-2 flex gap-2 justify-center">
          <button className="btn btn-success">
            <CheckIcon className="w-4"></CheckIcon> 儲存
          </button>
          <button
            className="btn btn-error btn-base-200"
            type="button"
            onClick={() => onClose?.()}
          >
            <XMarkIcon className="w-4"></XMarkIcon> 取消
          </button>
        </div>
      </div>

      <label className="modal-backdrop" onClick={() => onClose?.()}>
        Close
      </label>
    </div>
  );
}

export default UpdateRangeStoreInfoDialog;
