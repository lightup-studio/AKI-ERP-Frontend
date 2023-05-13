import { Suspense } from 'react';

import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import App from './app';
import store from './app/store';
import SuspenseContent from './containers/SuspenseContent';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const rootApp = (
  <Suspense fallback={<SuspenseContent />}>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <App />
      </Provider>
    </QueryClientProvider>
  </Suspense>
);

// if (import.meta.env.MODE === 'development') {
  import('../mocks/browser')
    .then(({ worker }) => {
      worker.start({
        onUnhandledRequest: 'bypass',
      });
    })
    .then(() => {
      root.render(rootApp);
    });
// } else {
  // root.render(rootApp);
// }
