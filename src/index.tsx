import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.scss';
import App from './App';
import store from './store/store';
import Root from './routes/Root';
import Popo, { loader } from './routes/Popo';

const ReactQueryDevtoolsProduction = lazy(() =>
  import('@tanstack/react-query-devtools/build/modern/production.js').then(d => ({
    default: d.ReactQueryDevtools,
  })),
);

const showDevtools = true;

// react query and react router...

import ErrorPage from './ErrorPage';
// import Root, { loader as rootLoader, action as rootAction } from './routes/root'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 10,
    },
  },
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    // // errorElement: <ErrorPage />,
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
        path: 'popo',
        element: <Popo />,
        loader: loader,
        errorElement: <ErrorPage />,
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
        {/* <App /> */}
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
