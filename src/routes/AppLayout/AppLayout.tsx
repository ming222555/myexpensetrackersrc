import React from 'react';

import { Outlet, Link } from 'react-router-dom';

export default function AppLayout(): JSX.Element {
  return (
    <div className='AppLayout'>
      <aside className='AppLayoutSider'>
        <p>Sider</p>
        <Link to='transactions'>Transactions</Link>
        <p>Sider</p>
        <p>Sider</p>
        <p>Sider</p>
        <p>Sider</p>
        <p>Sider</p>
        <p>Sider</p>
        <p>Sider</p>
        <p>Sider</p>
        <p>Sider</p>
        <p>Sider</p>
        <p>Sider</p>
        <p>Sider</p>
        <p>Sider</p>
        <p>Sider</p>
        <p>Sider</p>
        <p>Sider</p>
        <p>Sider</p>
        <p>Sider</p>
        <p>Sider</p>
        <p>Sider</p>
        <p>Sider</p>
        <p>Sider</p>
        <p>Sider</p>
        <p>Sider</p>
        <p>Sider666</p>
      </aside>
      <main className='AppLayoutMain'>
        <Outlet />
      </main>
      {/* AppLayout Sider... <Link to='transactions'>Transactions</Link> */}
    </div>
  );
}
