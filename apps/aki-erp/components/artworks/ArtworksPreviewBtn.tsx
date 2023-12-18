'use client';

import { ArtworkDetail, ArtworkMetadata } from '@data-access/models';
import { useRef } from 'react';

interface ArtworksPreviewBtnProps {
  artworks?: ArtworkDetail<ArtworkMetadata>[];
}

const ArtworksPreviewBtn: React.FC<ArtworksPreviewBtnProps> = ({ artworks }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button className="btn" onClick={() => dialogRef.current?.showModal()}>
        預覽
      </button>

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box">
          <h3 className="mb-4 text-lg font-bold">藝術品</h3>
          <div className="flex flex-wrap gap-4">
            {artworks?.map((item) => (
              <img
                key={item.id}
                src={item.imageUrl}
                alt={item.enName}
                loading="lazy"
                className="h-20"
              />
            ))}
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default ArtworksPreviewBtn;
