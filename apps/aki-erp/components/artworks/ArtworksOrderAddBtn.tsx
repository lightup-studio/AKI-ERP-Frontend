'use client';

import { useState } from 'react';

import { ArtworkDetail } from '@data-access/models';
import { PlusIcon } from '@heroicons/react/20/solid';
import ArtworksSelector from './ArtworksSelector';

interface ArtworksOrderAddBtnProps {
  onClose: (artworks: ArtworkDetail[]) => void;
}

const ArtworksOrderAddBtn: React.FC<ArtworksOrderAddBtnProps> = ({ onClose }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button className="btn btn-info" onClick={() => setIsOpen(true)}>
        <PlusIcon className="h-5 w-5"></PlusIcon>
        新增藝術品
      </button>

      <ArtworksSelector
        isOpen={isOpen}
        onClose={(selectedArtworks) => {
          selectedArtworks && selectedArtworks.length > 0 ? onClose(selectedArtworks) : onClose([]);
          setIsOpen(false);
        }}
      ></ArtworksSelector>
    </>
  );
};

export default ArtworksOrderAddBtn;
