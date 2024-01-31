import * as React from 'react';

import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

import './ErrorPage.scss';

const ERR_404 = 'Page not found';
const ERR_401 = 'Authentication error';
const ERR_403 = 'Authorisation error';
const ERR_500 = 'Internal server error';
const ERR_503 = 'Looks like our API is down';
const ERR_OTHER_STATUS = 'Unknown server error88888888';

export default function ErrorPage(): JSX.Element {
  const error = useRouteError();

  let msg = '';

  if (isRouteErrorResponse(error) && error.status) {
    console.log('error.data', error.data);
    const status = error.status;

    if (status === 404) {
      msg = ERR_404;
    } else if (status === 401) {
      msg = ERR_401;
    } else if (status === 403) {
      msg = ERR_403;
    } else if (status === 500) {
      msg = ERR_500;
    } else if (status === 503) {
      msg = ERR_503;
    } else {
      msg = 'Status ' + status + ', ' + ERR_OTHER_STATUS;
    }
  }

  if (error instanceof Error) {
    console.log('error.message', error.message);
    msg = error.message;
  }

  return (
    <p>
      <strong>Error</strong> <span>{msg}</span>
    </p>
  );
}
