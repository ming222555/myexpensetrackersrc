import { StrictMode, Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.scss';
import store from './store/store';
import AppLayout from './routes/AppLayout/AppLayout';
import Transactions, { /* loader, */ sumTransactionsAmountLoader } from './routes/Transactions/Transactions';
import Dashboard from './routes/Dashboard/Dashboard';
import queryClient from './reactquery';
import ErrorPage from './ErrorPage';

const ReactQueryDevtoolsProduction = lazy(() =>
  import('@tanstack/react-query-devtools/build/modern/production.js').then(d => ({
    default: d.ReactQueryDevtools,
  })),
);

const SHOW_DEV_TOOLS = true;

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    loader: sumTransactionsAmountLoader,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'transactions',
        element: <Transactions />,
        // loader,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={true} />
        {SHOW_DEV_TOOLS && (
          <Suspense fallback={null}>
            <ReactQueryDevtoolsProduction />
          </Suspense>
        )}
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
);
