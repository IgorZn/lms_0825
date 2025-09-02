'use client';

import React, { useState } from 'react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { courseFormPATCH } from '../lib/api-calls';

interface TitleFormProps {
  initialData: {
    title: string;
  };
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(2, { message: 'Title must be at least 2 characters long' }).max(250),
});

function TitleForm({ initialData, courseId }: TitleFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const toggleEdit = () => setIsEditing(prev => !prev);
  const { isSubmitting, isValid } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await courseFormPATCH(courseId, values);
      toast.success(<div className={'text-green-700'}>Course title updated successfully</div>);
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error(<div className={'text-red-500'}>Something went wrong</div>);
    }
  }

  return (
    <div className={'mt-6 rounded-md border bg-slate-50 p-4'}>
      <div className={'flex items-center justify-between font-medium'}>
        Course title
        {!isEditing && <p className={'text-sm font-light'}>{initialData.title}</p>}
        <Button type="submit" variant={'ghost'} onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className={'mr-2 h-4 w-4'} />
              Edit title
            </>
          )}
        </Button>
      </div>
      <div>
        {isEditing && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input disabled={isSubmitting} placeholder="e.g. JavaScript" {...field} />
                    </FormControl>
                    <FormDescription>This is your public display name.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Submit
              </Button>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
}

export default TitleForm;
