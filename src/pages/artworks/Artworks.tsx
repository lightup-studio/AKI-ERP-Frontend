import React, { Suspense } from 'react';

import SuspenseContent from 'containers/SuspenseContent';
import ArtworksDetail from 'features/artworks/ArtworksDetail';
import ArtworksList from 'features/artworks/ArtworksList';
import { useRoutes } from 'react-router-dom';

function ArtworksRoutes() {
  return useRoutes([
    {
      path: '',
      element: <ArtworksList />,
    },
    {
      path: 'add',
      element: <ArtworksDetail />,
    },
    {
      path: ':artworksId',
      element: <ArtworksDetail />,
    },
  ]);
}

function Artworks() {
  return (
    <Suspense fallback={<SuspenseContent />}>
      <ArtworksRoutes />
    </Suspense>
  );
}

export default Artworks;
