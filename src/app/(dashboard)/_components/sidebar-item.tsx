'use client';
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
  label: string;
  href: string;
  icon: LucideIcon;
}

function SidebarItem({ label, href, icon: Icon }: SidebarItemProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = (pathname === '/' && href === '/') || pathname === href || pathname.startsWith(`${href}/`);
  const onClick = () => {
    router.push(href);
  };
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-x-2 pl-6 text-sm font-[500] text-slate-500 transition-all hover:bg-slate-300/20 hover:text-slate-600',
        isActive && 'bg-sky-200/20 text-sky-700 hover:bg-sky-200/20 hover:text-sky-900',
      )}
    >
      <div className={'flex items-center gap-x-2 py-4'}>
        <Icon size={20} className={cn('text-slate-500', isActive && 'text-green-700')} />
      </div>
      {label}
      <div
        className={cn(
          'ml-auto h-full border-2 border-slate-500 opacity-0 transition-all hover:opacity-100',
          isActive && 'opacity-100',
        )}
      ></div>
    </button>
  );
}

export default SidebarItem;
