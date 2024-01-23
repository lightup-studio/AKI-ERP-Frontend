import { ArtworksDetail } from '@components/artworks';
import { Status } from '@data-access/models';

const DisabledArtworksAdd = () => {
  return <ArtworksDetail status={Status.Disabled} />;
};

export default DisabledArtworksAdd;
