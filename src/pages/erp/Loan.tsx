import React, { Suspense } from 'react';

import SuspenseContent from 'containers/SuspenseContent';
import { Navigate, useRoutes } from 'react-router-dom';
import LoanOrders from 'features/erp/loan/LoanOrders';
import LoanReturnOrders from 'features/erp/loan/LoanReturnOrders';

function LoanRoutes() {
  return useRoutes([
    {
      path: 'orders',
      element: <LoanOrders />,
    },
    {
      path: 'return-orders',
      element: <LoanReturnOrders />,
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

function Loan() {
  return (
    <Suspense fallback={<SuspenseContent />}>
      <LoanRoutes />
    </Suspense>
  );
}

export default Loan;
