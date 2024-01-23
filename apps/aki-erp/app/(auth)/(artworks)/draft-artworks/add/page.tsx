import { ArtworksDetail } from '@components/artworks';
import { Status } from '@data-access/models';

const DraftArtworksAdd = () => {
  return <ArtworksDetail status={Status.Draft} />;
};

export default DraftArtworksAdd;
