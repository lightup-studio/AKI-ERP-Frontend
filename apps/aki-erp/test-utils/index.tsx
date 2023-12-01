import { AppRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { NextRouter } from 'next/router';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function createTestWrapper({
  routerConfig,
}: {
  routerConfig?: Parameters<typeof createMockRouter>[0];
} = {}) {
  const mockRouter = createMockRouter(routerConfig);
  const queryClient = new QueryClient();
  return {
    mockRouter,
    queryClient,
    wrapper: ({ children }: { children: React.ReactElement }) => (
      <AppRouterContext.Provider value={mockRouter as any}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </AppRouterContext.Provider>
    ),
  };
}

export function createMockRouter(routerConfig?: Partial<NextRouter>) {
  return {
    basePath: '',
    pathname: '/',
    route: '/',
    query: {},
    asPath: '/',
    back: jest.fn(),
    beforePopState: jest.fn(),
    prefetch: jest.fn(),
    push: jest.fn(),
    reload: jest.fn(),
    replace: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
    isFallback: false,
    isLocaleDomain: false,
    isReady: true,
    defaultLocale: 'en',
    domainLocales: [],
    isPreview: false,
    ...routerConfig,
  } as NextRouter;
}
