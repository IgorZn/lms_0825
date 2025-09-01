'use client';

import React, { useState } from 'react';
import * as z from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ImageIcon, Pencil, PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { updateCourseDescription, updateCourseImage } from '../lib/api-calls';
import { cn } from '@/lib/utils';
import { Course } from '@prisma/client';
import { FileUploader } from '@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/file-uploader';

interface ImageFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  imageUrl: z.string().min(1, { message: 'Image is required' }),
});

function ImageForm({ initialData, courseId }: ImageFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const toggleEdit = () => setIsEditing(prev => !prev);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await updateCourseImage(courseId, values.imageUrl);
      toast.success(<div className={'text-green-700'}>Course description updated successfully</div>);
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error(<div className={'text-red-500'}>Something went wrong</div>);
    }
  }

  return (
    <div className={'mt-6 rounded-md border bg-slate-50 p-4'}>
      <div className={'flex items-center justify-between font-medium'}>
        Image
        {!isEditing && (
          <p className={cn('text-sm font-light', !initialData.imageUrl && 'italic text-slate-500')}>
            {initialData.imageUrl || 'No images provided'}
          </p>
        )}
        <Button type="submit" variant={'ghost'} onClick={toggleEdit}>
          {isEditing && <>Cancel</>}

          {!isEditing && !initialData.imageUrl && (
            <>
              <PlusCircle className={'mr-2 h-4 w-4'} /> Add image
            </>
          )}

          {!isEditing && initialData.imageUrl && (
            <>
              <Pencil className={'mr-2 h-4 w-4'} /> Edit image
            </>
          )}
        </Button>
      </div>

      {!isEditing &&
        (!initialData.imageUrl ? (
          <div className={'flex h-64 items-center justify-center rounded-md bg-slate-200'}>
            <ImageIcon className={'h-10 w-10 text-slate-500'} />
          </div>
        ) : (
          <img src={initialData.imageUrl} alt="Course image" className={'rounded-md'} />
        ))}
      {!isEditing && initialData.imageUrl && (
        <div className={'relative mt-2 aspect-video'}>
          <Image src={initialData.imageUrl} fill alt="Course image" className={'rounded-md object-cover'} />
        </div>
      )}

      <div>
        <div>
          {isEditing && (
            <>
              <FileUploader
                endpoint={'courseImage'}
                onChange={(url: string | null) => {
                  if (url) {
                    onSubmit({ imageUrl: url });
                  }
                }}
              />
              <div className={'text-sm text-muted-foreground'}>16:9 aspect ratio recommended</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageForm;
