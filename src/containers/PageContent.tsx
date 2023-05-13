import { Suspense, useEffect, useRef } from 'react';

import { useSelector } from 'react-redux';
import { useRoutes } from 'react-router-dom';

import routes from '../routes';
import Header from './Header';
import SuspenseContent from './SuspenseContent';

function PageContentRoutes() {
  return useRoutes(routes);
}

function PageContent() {
  const mainContentRef = useRef<HTMLElement>(null);
  const { pageTitle } = useSelector<any, any>((state) => state.header);

  // Scroll back to top on new page load
  useEffect(() => {
    mainContentRef.current?.scroll({
      top: 0,
      behavior: 'smooth',
    });
  }, [pageTitle]);

  return (
    <div className="drawer-content flex flex-col ">
      <Header />
      <main
        className="flex-1 overflow-y-auto pt-8 px-6  bg-base-200"
        ref={mainContentRef}
      >
        <Suspense fallback={<SuspenseContent />}>
          <PageContentRoutes />
        </Suspense>
        <div className="h-16"></div>
      </main>
    </div>
  );
}

export default PageContent;
