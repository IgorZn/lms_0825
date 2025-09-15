'use client';

import React, { useState } from 'react';
import * as z from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2, File, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { courseAttachmentDELETE, courseAttachmentPOST } from '../lib/api-calls';
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
  const [deletingId, setDeletingId] = useState<string | null>(null);
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

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await courseAttachmentDELETE(courseId, id);
      toast.success(<div className={'text-green-700'}>Course attachments updated successfully</div>, {
        duration: 1000,
      });
      router.refresh();
    } catch (error) {
      toast.error(<div className={'text-red-500'}>Something went wrong</div>);
    } finally {
      setDeletingId(null);
    }
  };

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
          {initialData.attachments.length > 0 && (
            <div className={'mt-2 space-y-2'}>
              {initialData.attachments.map(attachment => (
                <div key={attachment.id} className={'flex items-center'}>
                  <div className={'flex w-full justify-between rounded-md border-sky-200 bg-sky-100 p-3'}>
                    <div className={'flex items-center'}>
                      <File className={'mr-2 h-4 w-4'} />
                      <p className={'line-clamp-3 text-xs font-medium'}>{attachment.name}</p>
                    </div>

                    {deletingId == attachment.id && (
                      <div>
                        <Loader2 className={'mr-2 h-4 w-4 animate-spin'} />
                      </div>
                    )}
                    {deletingId !== attachment.id && (
                      <Button
                        type="submit"
                        variant={'ghost'}
                        className={'border border-red-500'}
                        onClick={() => onDelete(attachment.id)}
                      >
                        <Trash2 className={'mr-2 h-4 w-4'} /> Delete
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
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
