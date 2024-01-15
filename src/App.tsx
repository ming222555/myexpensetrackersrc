import React, { useState, useEffect, Suspense, lazy } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import TransactionsPage from './pages/TransactionsPage/TransactionsPage';

const queryClientForProvider = new QueryClient();

const ReactQueryDevtoolsProduction = lazy(() =>
  import('@tanstack/react-query-devtools/build/modern/production.js').then(d => ({
    default: d.ReactQueryDevtools,
  })),
);

function App(): JSX.Element {
  const [showDevtools, setShowDevtools] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.toggleDevtools = (): void => setShowDevtools(old => !old);
  }, []);

  return (
    <QueryClientProvider client={queryClientForProvider}>
      <TransactionsPage />
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <button onClick={(): void => window.toggleDevtools()}>devtools</button>
      <ReactQueryDevtools initialIsOpen={true} />
      {showDevtools && (
        <Suspense fallback={null}>
          <ReactQueryDevtoolsProduction />
        </Suspense>
      )}
    </QueryClientProvider>
  );
}

export default App;
