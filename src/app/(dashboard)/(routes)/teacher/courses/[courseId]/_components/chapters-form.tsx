'use client';

import React, { useState } from 'react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Loader2, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { chapterFormPOST, chapterReorderPUT, courseFormPATCH } from '../lib/api-calls';
import { cn } from '@/lib/utils';
import { Chapter, Course } from '@prisma/client';
import { Input } from '@/components/ui/input';
import ChapterList from './chapter-list';

interface ChaptersFormProps {
  initialData: Course & { chapters: Chapter[] };
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(2, { message: 'Title must be at least 2 characters long' }).max(250),
});

function ChaptersForm({ initialData, courseId }: ChaptersFormProps) {
  const [isCreating, setIsCreateing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: '' },
  });

  const toggleCreating = () => setIsCreateing(prev => !prev);
  const { isSubmitting, isValid } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsUpdating(true);
      await chapterFormPOST(courseId, values);
      toast.success(<div className={'text-green-700'}>Course description updated successfully</div>);
      toggleCreating();
      router.refresh();
    } catch (error) {
      toast.error(<div className={'text-red-500'}>Something went wrong</div>);
    } finally {
      setIsUpdating(false);
    }
  }

  const onReorder = async (reorderedChapters: Chapter[]) => {
    const newOrder = reorderedChapters.map((chapter, index) => ({
      ...chapter,
      id: chapter.id,
      position: index + 1,
    }));
    try {
      setIsUpdating(true);
      await chapterReorderPUT(initialData.id, newOrder);
      toast.success(<div className={'text-green-700'}>Chapters reordered successfully</div>, { duration: 1500 });
      router.refresh();
    } catch (error) {
      toast.error(<div className={'text-red-500'}>Something went wrong</div>, { duration: 1500 });
    } finally {
      setIsUpdating(false);
    }
  };

  const onEdit = (chapterId: string) => {
    router.push(`/teacher/courses/${courseId}/chapters/${chapterId}`);
  };

  return (
    <div className={'relative mt-6 rounded-md border bg-slate-50 p-4'}>
      {isUpdating && (
        <div
          className={
            'absolute right-0 top-0 z-50 flex h-full w-full items-center justify-center rounded-md bg-slate-500/20'
          }
        >
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      )}
      <div className={'flex items-center justify-between font-medium'}>
        Course chapters
        <Button type="submit" variant={'ghost'} onClick={toggleCreating}>
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className={'mr-2 h-4 w-4'} />
              Add chapter
            </>
          )}
        </Button>
      </div>
      <div>
        {isCreating && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="Give a description of the chapter"
                        className="resize-none bg-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Create
              </Button>
            </form>
          </Form>
        )}
        {!isCreating && (
          <div className={cn('text-sm font-light', !initialData.chapters.length && 'italic text-slate-500')}>
            {!initialData.chapters.length && 'No chapters yet'}
            <ChapterList onEdit={onEdit} onReorder={onReorder} items={initialData.chapters || []} />
          </div>
        )}
        {!isCreating && <p className={'mt-4 text-xs text-muted-foreground'}>Drag and drop to reorder chapters</p>}
      </div>
    </div>
  );
}

export default ChaptersForm;
