import React from 'react';

import { Outlet } from 'react-router-dom';

// import SiderDrawer from './components/SiderDrawer';
import SiderDrawer2 from './components/SiderDrawer2';
import SiderContent from './AppLayoutSider/Content';

export default function AppLayout(): JSX.Element {
  return (
    <div className='AppLayout'>
      <aside className='AppLayoutSider'>
        <SiderDrawer2 as='nav' className='d-inline-flex flex-column position-relative'>
          <SiderContent />
        </SiderDrawer2>
      </aside>
      <main className='AppLayoutMain'>
        <Outlet />
      </main>
    </div>
  );
}
