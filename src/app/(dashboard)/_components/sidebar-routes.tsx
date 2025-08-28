'use client';
import React from 'react';
import { Compass, Layout } from 'lucide-react';
import SidebarItem from '@/app/(dashboard)/_components/sidebar-item';

const getRoutes = () => {
  return [
    {
      label: 'Dashboard',
      href: '/',
      icon: Layout,
    },
    {
      label: 'Browse',
      href: '/search',
      icon: Compass,
    },
  ];
};

function SidebarRoutes() {
  const routes = getRoutes();
  return (
    <div className={'flex w-full flex-col'}>
      {routes.map(route => (
        <SidebarItem key={route.href} {...route} />
      ))}
    </div>
  );
}

export default SidebarRoutes;
