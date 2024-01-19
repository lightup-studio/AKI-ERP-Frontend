import { ArtworksDetail } from '@components/artworks';
import { Status } from '@data-access/models';

const ArtworksAdd = () => {
  return <ArtworksDetail status={Status.Enabled} />;
};

export default ArtworksAdd;
