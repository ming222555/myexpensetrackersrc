import React from 'react';

import { Outlet } from 'react-router-dom';

import SiderDrawer from './components/SiderDrawer';
import SiderContent from './AppLayoutSider/Content';

export default function AppLayout(): JSX.Element {
  return (
    <div className='AppLayout'>
      <aside className='AppLayoutSider'>
        <SiderDrawer className='d-flex flex-column'>
          <SiderContent />
        </SiderDrawer>
      </aside>
      <main className='AppLayoutMain'>
        <Outlet />
      </main>
    </div>
  );
}
