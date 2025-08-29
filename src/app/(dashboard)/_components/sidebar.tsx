import React from 'react';
import Logo from '@/app/(dashboard)/_components/logo';
import SidebarRoutes from '@/app/(dashboard)/_components/sidebar-routes';

function Sidebar() {
  return (
    <div className={'flex h-full flex-col overflow-y-auto border-r bg-white shadow-sm'}>
      <div className={'p-6 pb-[27px]'}>
        <Logo />
      </div>
      <div className={'flex w-full flex-col'}>
        <SidebarRoutes />
      </div>
    </div>
  );
}

export default Sidebar;
