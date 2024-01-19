import { ArtworksDetail } from '@components/artworks';
import { Status } from '@data-access/models';

const DraftArtworksId = () => {
  return <ArtworksDetail status={Status.Draft} />;
};

export default DraftArtworksId;
