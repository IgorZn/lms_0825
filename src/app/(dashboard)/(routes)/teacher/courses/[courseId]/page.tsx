import React from 'react';
import { getCourseById } from '@/app/(dashboard)/(routes)/teacher/courses/lib/course-helper';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import TitleForm from './_components/title-form';
import DescriptionForm from './_components/description-form';
import ImageForm from './_components/image-form';

async function Page({ params }: { params: { courseId: string } }) {
  const { userId } = await auth();
  const course = await getCourseById(params.courseId);

  if (!userId) {
    return redirect('/');
  }

  if (!course) {
    return redirect('/');
  }

  const requiredFields = [course.title, course.description, course.imageUrl, course.price, course.categoryId];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completedText = `(${completedFields}/${totalFields})`;

  return (
    <div className={'p-6'}>
      <div className={'flex items-center justify-between'}>
        <div className={'flex flex-col gap-y-2'}>
          <h1 className={'text-2xl font-medium'}>Course setup</h1>
          <span className={'text-sm text-muted-foreground'}>Complete all fields {completedText}</span>
        </div>
      </div>
      <div className={'mt-6 grid grid-cols-1 gap-6 md:grid-cols-3'}>
        <div>
          <div className={'flex items-center gap-x-2'}>
            <h2 className={'text-2xl font-light'}>Customize your course</h2>
          </div>
        </div>
      </div>
      <TitleForm initialData={course} courseId={course.id} />
      <DescriptionForm initialData={{ description: course.description ?? '' }} courseId={course.id} />
      <ImageForm initialData={course} courseId={course.id} />
    </div>
  );
}

export default Page;
