'use client';
import React from 'react';
import { BarChart, Book, Compass, Layout } from 'lucide-react';
import SidebarItem from '@/app/(dashboard)/_components/sidebar-item';
import { usePathname } from 'next/navigation';

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

const getTeacherRoutes = () => {
  return [
    {
      label: 'Courses',
      href: '/teacher/courses',
      icon: Book,
    },
    {
      label: 'Analytics',
      href: '/teacher/analytics',
      icon: BarChart,
    },
  ];
};

function SidebarRoutes() {
  const pathname = usePathname();
  const isTeacher = pathname?.includes('/teacher');

  const routes = isTeacher ? getTeacherRoutes() : getRoutes();

  return (
    <div className={'flex w-full flex-col'}>
      {routes.map(route => (
        <SidebarItem key={route.href} {...route} />
      ))}
    </div>
  );
}

export default SidebarRoutes;
