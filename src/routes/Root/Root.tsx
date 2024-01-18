import React from 'react';

import { Outlet, Link } from 'react-router-dom';

export default function Root(): JSX.Element {
  return (
    <div className='Root'>
      Root Sider... <Link to='transactions'>Transactions</Link>
      <Outlet />
    </div>
  );
}
