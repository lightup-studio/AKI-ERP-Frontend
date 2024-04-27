'use client';

import Dialog from '@components/shared/Dialog';
import { ArtworkDetail, ArtworkMetadata } from '@data-access/models';
import { useState } from 'react';

interface ArtworksPreviewBtnProps {
  artworks?: ArtworkDetail<ArtworkMetadata>[];
}

const ArtworksPreviewBtn: React.FC<ArtworksPreviewBtnProps> = ({ artworks }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="btn" onClick={() => setOpen(true)}>
        預覽
      </button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <h3 className="mb-4 text-lg font-bold">藝術品</h3>
        <div className="flex flex-wrap gap-4">
          {artworks?.map((item) => (
            <img
              key={item.id}
              src={item.thumbnailUrl || item.imageUrl}
              alt={item.enName}
              loading="lazy"
              className="h-20"
            />
          ))}
        </div>
      </Dialog>
    </>
  );
};

export default ArtworksPreviewBtn;
