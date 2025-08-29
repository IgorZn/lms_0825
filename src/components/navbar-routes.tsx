'use client';

import React from 'react';
import { UserButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import Link from 'next/link';

function NavbarRoutes() {
  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith('/teacher');
  const isStudentPage = pathname?.includes('/student');

  return (
    <div className={'ml-auto flex gap-x-2'}>
      {isTeacherPage || isStudentPage ? (
        <Link href={'/'}>
          <Button>
            <LogOut className={'h-4 w-4'} />
          </Button>
        </Link>
      ) : (
        <Link href={'/teacher/courses'}>
          <Button size={'sm'} variant={'ghost'}>
            Teacher mode
          </Button>
        </Link>
      )}
      <UserButton />
    </div>
  );
}

export default NavbarRoutes;
