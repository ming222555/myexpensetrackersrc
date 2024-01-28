import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.scss';
import store from './store/store';
import AppLayout from './routes/AppLayout/AppLayout';
import Transactions, { loader } from './routes/Transactions/Transactions';
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
    // errorElement: <ErrorPage />,
    errorElement: <ErrorPage />,
    // loader: rootLoader(queryClient),
    // action: rootAction(queryClient),
    children: [
      // {
      //   index: true,
      //   element: <Index />,
      // },
      // {
      //   path: 'contacts/:contactId',
      //   element: <Contact />,
      //   loader: contactLoader(queryClient),
      //   action: contactAction(queryClient),
      // },
      {
        path: 'transactions',
        element: <Transactions />,
        loader: loader,
      },
      // {
      //   path: 'contacts/:contactId/edit',
      //   element: <EditContact />,
      //   loader: contactLoader(queryClient),
      //   action: editAction(queryClient),
      // },
      // {
      //   path: 'contacts/:contactId/destroy',
      //   element: <EditContact />,
      //   action: destroyAction(queryClient),
      //   errorElement: <div>Oops! There was an error.</div>,
      // },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
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
  </React.StrictMode>,
);
