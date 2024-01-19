import { ArtworksDetail } from '@components/artworks';
import { Status } from '@data-access/models';

const ArtworksId = () => {
  return <ArtworksDetail status={Status.Enabled} />;
};

export default ArtworksId;
