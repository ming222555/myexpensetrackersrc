import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import './index.scss';
import App from './App';
import store from './store/store';

const queryClientForProvider = new QueryClient();

const ReactQueryDevtoolsProduction = lazy(() =>
  import('@tanstack/react-query-devtools/build/modern/production.js').then(d => ({
    default: d.ReactQueryDevtools,
  })),
);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const showDevtools = true;

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClientForProvider}>
        <App />
        <ReactQueryDevtools initialIsOpen={true} />
        {showDevtools && (
          <Suspense fallback={null}>
            <ReactQueryDevtoolsProduction />
          </Suspense>
        )}
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>,
);
