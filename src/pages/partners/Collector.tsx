import React, { Suspense } from 'react';

import SuspenseContent from 'containers/SuspenseContent';
import { Navigate, useRoutes } from 'react-router-dom';

function CollectorRoutes() {
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

function Collector() {
  return (
    <Suspense fallback={<SuspenseContent />}>
      <CollectorRoutes />
    </Suspense>
  );
}

export default Collector;
