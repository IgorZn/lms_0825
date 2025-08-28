import React from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './sidebar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger className={'pr-4 transition hover:opacity-75 md:hidden'}>
        <Menu />
      </SheetTrigger>
      <SheetContent side={'left'} className={'p-0'}>
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
}

export default MobileSidebar;
