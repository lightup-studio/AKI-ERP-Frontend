import React, { Suspense } from 'react';

import SuspenseContent from 'containers/SuspenseContent';
import TransferOrders from 'features/erp/transfer/TransferOrders';
import { Navigate, useRoutes } from 'react-router-dom';

function TransferRoutes() {
  return useRoutes([
    {
      path: 'orders',
      element: <TransferOrders />,
    },
    {
      path: '*',
      element: <Navigate to="./orders" replace />,
    },
    // {
    //   path: ':artworksId',
    //   element: <ArtworksDetail />,
    // },
  ]);
}

function Transfer() {
  return (
    <Suspense fallback={<SuspenseContent />}>
      <TransferRoutes />
    </Suspense>
  );
}

export default Transfer;
