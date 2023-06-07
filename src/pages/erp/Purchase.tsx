import React, { Suspense } from 'react';

import SuspenseContent from 'containers/SuspenseContent';
import AddPurchaseOrder from 'features/erp/purchase/AddPurchaseOrder';
import PurchaseOrders from 'features/erp/purchase/PurchaseOrders';
import PurchaseReturnOrders from 'features/erp/purchase/PurchaseReturnOrders';
import { Navigate, useRoutes } from 'react-router-dom';

function PurchaseRoutes() {
  return useRoutes([
    {
      path: 'orders',
      element: <PurchaseOrders />,
    },
    {
      path: 'orders/add',
      element: <AddPurchaseOrder />,
    },
    {
      path: 'return-orders',
      element: <PurchaseReturnOrders />,
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

function Purchase() {
  return (
    <Suspense fallback={<SuspenseContent />}>
      <PurchaseRoutes />
    </Suspense>
  );
}

export default Purchase;
