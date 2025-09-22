import { LayoutDashboard, Badge, SlidersHorizontal } from 'lucide-react';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ChapterTitleForm from '../_components/chapter-title-form';
import ChapterDescriptionForm from '@/app/(dashboard)/(routes)/teacher/courses/[courseId]/chapters/_components/chapter-description-form';

async function Page({ params }: { params: { courseId: string; chapterId: string } }) {
  const { courseId, chapterId } = params;
  const { userId } = await auth();

  const chapter = await prisma.chapter.findUnique({
    where: {
      id: chapterId,
      courseId,
    },
    include: {
      muxDate: true,
    },
  });

  if (!chapter) return redirect('/');

  if (!userId) return redirect('/');

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completedText = `(${completedFields}/${totalFields})`;

  return (
    <div className={'p-6'}>
      <div className={'flex items-center justify-between'}>
        <div className={'w-full'}>
          <Link
            href={`/teacher/courses/${courseId}`}
            className={'mb-6 flex items-center text-sm transition hover:opacity-75'}
          >
            <ArrowLeft className={'h-4 w-4'} />
            <span>Back to chapters</span>
          </Link>
          <div className={'mt-6 flex w-full items-center justify-between'}>
            <div className={'flex flex-col gap-y-2'}>
              <h1 className={'text-2xl font-medium'}>Chapter creation</h1>
            </div>
          </div>
          <div className={'flex items-center gap-x-2'}>
            <span className={'text-sm text-muted-foreground'}>Completed fields {completedText}</span>
          </div>
        </div>
      </div>
      <div className={'mt-16 grid grid-cols-1 gap-6 md:grid-cols-2'}>
        <div className={'space-y-4'}>
          <div>
            <div className={'flex items-center gap-x-2'}>
              <SlidersHorizontal size={24} className={'h-6 w-6 text-2xl'} />
              Customize your chapter
            </div>
            <ChapterTitleForm initialData={chapter} courseId={courseId} chapterId={chapterId} />
            <ChapterDescriptionForm initialData={chapter} courseId={courseId} chapterId={chapterId} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
