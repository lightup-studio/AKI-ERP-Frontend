import { ArtworksDetail } from '@components/artworks';
import { Status } from '@data-access/models';

const DisabledArtworksId = () => {
  return <ArtworksDetail status={Status.Disabled} />;
};

export default DisabledArtworksId;
