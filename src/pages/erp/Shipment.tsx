import React, { Suspense } from 'react';

import SuspenseContent from 'containers/SuspenseContent';
import ShipmentOrders from 'features/erp/shipment/ShipmentOrders';
import ShipmentReturnOrders from 'features/erp/shipment/ShipmentReturnOrders';
import { Navigate, useRoutes } from 'react-router-dom';

function ShipmentRoutes() {
  return useRoutes([
    {
      path: 'orders',
      element: <ShipmentOrders />,
    },
    {
      path: 'return-orders',
      element: <ShipmentReturnOrders />,
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

function Shipment() {
  return (
    <Suspense fallback={<SuspenseContent />}>
      <ShipmentRoutes />
    </Suspense>
  );
}

export default Shipment;
