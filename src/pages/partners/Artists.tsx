import React, { Suspense } from 'react';

import SuspenseContent from 'containers/SuspenseContent';
import ArtistList from 'features/partners/artists/ArtistList';
import { Navigate, useRoutes } from 'react-router-dom';

function ArtistsRoutes() {
  return useRoutes([
    {
      path: '',
      element: <ArtistList />,
    },
    {
      path: '*',
      element: <Navigate to="./" replace />,
    },
  ]);
}

function Artists() {
  return (
    <Suspense fallback={<SuspenseContent />}>
      <ArtistsRoutes />
    </Suspense>
  );
}

export default Artists;
