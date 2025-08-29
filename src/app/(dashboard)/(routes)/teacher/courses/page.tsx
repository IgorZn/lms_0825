import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';

function Page() {
  return (
    <div className={'p-6'}>
      <Link href={'/teacher/courses/new'}>
        <Button>Add Course</Button>
      </Link>
    </div>
  );
}

export default Page;
