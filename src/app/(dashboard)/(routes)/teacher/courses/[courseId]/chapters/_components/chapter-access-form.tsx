'use client';

import React, { useState } from 'react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Pencil, Lock, LockOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { chapterFormPATCH } from '../../lib/api-calls';
import { cn } from '@/lib/utils';
import { Chapter } from '@prisma/client';
import { Checkbox } from '@/components/ui/checkbox';

interface ChapterAccessFormProps {
  initialData: Chapter;
  chapterId: string;
  courseId: string;
}

const formSchema = z.object({
  isFree: z.boolean().default(false).optional(),
});

function ChapterAccessForm({ initialData, courseId, chapterId }: ChapterAccessFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { isFree: initialData.isFree || false },
  });

  const toggleEdit = () => setIsEditing(prev => !prev);
  const { isSubmitting, isValid } = form.formState;

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
        Chapter access
        <Button type="submit" variant={'ghost'} onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className={'mr-2 h-4 w-4'} />
              Edit access
            </>
          )}
        </Button>
        {!isEditing && (
          <div className={cn('text-sm font-light', !initialData.isFree && 'italic text-slate-500')}>
            {initialData.isFree ? (
              <>
                <div className={'flex items-center gap-x-2'}>
                  <LockOpen className={'mr-2 h-6 w-6 text-green-500'} />
                  This chapter is free
                </div>
              </>
            ) : (
              <>
                <div className={'flex items-center gap-x-2'}>
                  <Lock className={'mr-2 h-6 w-6 text-red-500'} />
                  This chapter is not free
                </div>
              </>
            )}
          </div>
        )}
      </div>
      <div>
        {isEditing && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-8">
              <FormField
                control={form.control}
                name="isFree"
                render={({ field }) => (
                  <FormItem
                    className={'flex flex-row items-center justify-start space-x-3 space-y-0 rounded-md border p-3'}
                  >
                    <FormControl className={'flex items-center justify-center'}>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className={'space-y-1 leading-none'}>
                      <FormDescription>Check this box if the chapter is free</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Save
              </Button>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
}

export default ChapterAccessForm;
