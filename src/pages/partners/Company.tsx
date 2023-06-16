import React, { Suspense } from 'react';

import SuspenseContent from 'containers/SuspenseContent';
import { Navigate, useRoutes } from 'react-router-dom';

function CompanyRoutes() {
  return useRoutes([
    {
      path: '',
      // element: <LoanOrders />,
    },
    {
      path: '*',
      element: <Navigate to="./" replace />,
    },
  ]);
}

function Company() {
  return (
    <Suspense fallback={<SuspenseContent />}>
      <CompanyRoutes />
    </Suspense>
  );
}

export default Company;
