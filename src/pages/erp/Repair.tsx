import React, { Suspense } from 'react';

import SuspenseContent from 'containers/SuspenseContent';
import RepairOrders from 'features/erp/repair/RepairOrders';
import RepairReturnOrders from 'features/erp/repair/RepairReturnOrders';
import { Navigate, useRoutes } from 'react-router-dom';

function RepairRoutes() {
  return useRoutes([
    {
      path: 'orders',
      element: <RepairOrders />,
    },
    {
      path: 'return-orders',
      element: <RepairReturnOrders />,
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

function Repair() {
  return (
    <Suspense fallback={<SuspenseContent />}>
      <RepairRoutes />
    </Suspense>
  );
}

export default Repair;
