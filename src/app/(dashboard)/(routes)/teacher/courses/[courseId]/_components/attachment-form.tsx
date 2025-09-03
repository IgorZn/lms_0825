'use client';

import React, { useState } from 'react';
import * as z from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { courseAttachmentPOST } from '../lib/api-calls';
import { cn } from '@/lib/utils';
import { Attachment, Course } from '@prisma/client';
import { FileUploader } from '@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/file-uploader';

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
}

const formSchema = z.object({
  url: z.string().min(1),
});

function AttachmentForm({ initialData, courseId }: AttachmentFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const toggleEdit = () => setIsEditing(prev => !prev);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await courseAttachmentPOST(courseId, values);
      toast.success(<div className={'text-green-700'}>Course attachments updated successfully</div>);
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error(<div className={'text-red-500'}>Something went wrong</div>);
    }
  }

  return (
    <div className={'mt-6 rounded-md border bg-slate-50 p-4'}>
      <div className={'flex items-center justify-between font-medium'}>
        Course attachments
        {!isEditing && (
          <p className={cn('text-sm font-light', !initialData.imageUrl && 'italic text-slate-500')}>
            {initialData.attachments.length || 'No files provided'}
          </p>
        )}
        <Button type="submit" variant={'ghost'} onClick={toggleEdit}>
          {isEditing && <>Cancel</>}

          {!isEditing && (
            <>
              <PlusCircle className={'mr-2 h-4 w-4'} /> Add file
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <>
          {initialData.attachments.length === 0 && (
            <p className={'mt-2 text-sm italic text-slate-500'}>No attachments yet</p>
          )}
        </>
      )}

      <div>
        <div>
          {isEditing && (
            <>
              <FileUploader
                endpoint={'courseAttachment'}
                onChange={(url: string | null) => {
                  if (url) {
                    onSubmit({ url });
                  }
                }}
              />
              <div className={'text-sm text-muted-foreground'}>Add attachments for this course</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AttachmentForm;
