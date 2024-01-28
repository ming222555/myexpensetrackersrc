import React from 'react';

import { Outlet, Link } from 'react-router-dom';

export default function AppLayout(): JSX.Element {
  return (
    <div className='AppLayout'>
      AppLayout Sider... <Link to='transactions'>Transactions</Link>
      <Outlet />
    </div>
  );
}
