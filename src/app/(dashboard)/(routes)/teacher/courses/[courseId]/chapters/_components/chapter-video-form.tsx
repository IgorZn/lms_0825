'use client';

import React, { useState } from 'react';
import MuxPlayer from '@mux/mux-player-react';
import * as z from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Pencil, PlusCircle, Video } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Chapter, MuxDate } from '@prisma/client';
import { FileUploader } from '@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/file-uploader';
import { chapterFormPATCH } from '@/app/(dashboard)/(routes)/teacher/courses/[courseId]/lib/api-calls';

interface ChapterVideoFormProps {
  initialData: Chapter & { muxDate?: MuxDate | null };
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

function ChapterVideoForm({ initialData, courseId, chapterId }: ChapterVideoFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const toggleEdit = () => setIsEditing(prev => !prev);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await chapterFormPATCH(courseId, chapterId, values);
      toast.success(<div className={'text-green-700'}>Chapter description updated successfully</div>);
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error(<div className={'text-red-500'}>Something went wrong</div>);
    }
  }

  return (
    <div className={'mt-6 rounded-md border bg-slate-50 p-4'}>
      <div className={'flex items-center justify-between font-medium'}>
        Video
        {!isEditing && (
          <p className={cn('text-sm font-light', !initialData.videoUrl && 'italic text-slate-500')}>
            {initialData.videoUrl ? (
              <MuxPlayer
                playbackId={initialData.muxDate?.playbackId || ''}
                metadata={{
                  video_id: initialData.muxDate?.assetId,
                }}
              />
            ) : (
              'No video provided'
            )}
          </p>
        )}
        <Button type="submit" variant={'ghost'} onClick={toggleEdit}>
          {isEditing && <>Cancel</>}

          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className={'mr-2 h-4 w-4'} /> Add video
            </>
          )}

          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className={'mr-2 h-4 w-4'} /> Edit video
            </>
          )}
        </Button>
      </div>

      {!isEditing &&
        (!initialData.videoUrl ? (
          <div className={'flex h-64 items-center justify-center rounded-md bg-slate-200'}>
            <Video className={'h-10 w-10 text-slate-500'} />
          </div>
        ) : (
          <div className={'flex items-center justify-center'}>Video uploaded</div>
        ))}

      <div>
        <div>
          {isEditing && (
            <>
              <FileUploader
                endpoint={'chapterVideo'}
                onChange={(url: string | null) => {
                  if (url) {
                    onSubmit({ videoUrl: url });
                  }
                }}
              />
              {/*<MuxUploader endpoint="https://api.mux.com/video/v1/signing-keys" />*/}
              <div className={'text-sm text-muted-foreground'}>Upload chapter&apos;s video</div>
            </>
          )}
        </div>
      </div>
      {!initialData.videoUrl && !isEditing && (
        <div className={'mt-2 text-sm text-muted-foreground'}>
          Video can take a few minutes to process. Please be patient. Refresh the page to see the video if it&apos;s not
          visible.
        </div>
      )}
    </div>
  );
}

export default ChapterVideoForm;
