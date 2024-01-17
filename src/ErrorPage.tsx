import * as React from 'react';

import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

export default function ErrorPage(): JSX.Element {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    console.log('error.data', error.data);

    if (error.status === 404) {
      return <div>This page not exist!klop</div>;
    }

    if (error.status === 401) {
      return <div>You not authorized to see this</div>;
    }

    if (error.status === 503) {
      return <div>Looks like our API is down</div>;
    }

    if (error.status === 418) {
      return <div>🫖</div>;
    }
  }

  return <div>Something went wrong</div>;
}
