import React from 'react';

import { Outlet } from 'react-router-dom';

// import SiderDrawer from './components/SiderDrawer';
import SiderDrawer2 from './components/SiderDrawer2';
import AppSiderContent from './AppLayoutSider/Content';

export default function AppLayout(): JSX.Element {
  return (
    <div className='AppLayout'>
      <aside className='AppLayoutSider position-relative'>
        <SiderDrawer2 as='nav' className='d-inline-flex flex-column position-relative'>
          <AppSiderContent />
        </SiderDrawer2>
      </aside>
      <main className='AppLayoutMain'>
        <Outlet />
      </main>
    </div>
  );
}
