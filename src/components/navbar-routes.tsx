'use client';

import React from 'react';
import { UserButton } from '@clerk/nextjs';

function NavbarRoutes() {
  return (
    <div className={'ml-auto flex gap-x-2'}>
      <UserButton />
    </div>
  );
}

export default NavbarRoutes;
