'use client';

import { ArtworkDetail, ArtworkMetadata } from '@data-access/models';
import { Button } from 'react-aria-components';

interface ArtworksPreviewBtnProps {
  artworks?: ArtworkDetail<ArtworkMetadata>[];
}

const ArtworksPreviewBtn: React.FC<ArtworksPreviewBtnProps> = () => {
  return <Button className="btn">預覽</Button>;
};

export default ArtworksPreviewBtn;
