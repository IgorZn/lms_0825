'use client';

import React, { useState } from 'react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Course } from '@prisma/client';
import { Combobox } from '@/components/ui/combobox';
import { updateCourseCategory } from '@/app/(dashboard)/(routes)/teacher/courses/[courseId]/lib/api-calls';

interface CategoryFormProps {
  initialData: Course;
  courseId: string;
  options: { label: string; value: string }[];
}

const formSchema = z.object({
  categoryId: z.string().min(1),
});

function CategoryForm({ initialData, courseId, options }: CategoryFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: initialData.categoryId || '',
    },
  });

  const toggleEdit = () => setIsEditing(prev => !prev);
  const { isSubmitting, isValid } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await updateCourseCategory(courseId, values.categoryId);
      toast.success(<div className={'text-green-700'}>Course category updated successfully</div>, { duration: 1000 });
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error(<div className={'text-red-500'}>Something went wrong</div>);
    }
  }

  const selectedOption = options.find(option => option.value === initialData.categoryId);

  return (
    <div className={'mt-6 rounded-md border bg-slate-50 p-4'}>
      <div className={'flex items-center justify-between font-medium'}>
        Course category
        {!isEditing && (
          <p className={cn('text-sm font-light', !initialData.categoryId && 'italic text-slate-500')}>
            {selectedOption?.label || 'No category'}
          </p>
        )}
        <Button type="submit" variant={'ghost'} onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className={'mr-2 h-4 w-4'} />
              Edit category
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
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Combobox options={options} {...field} />
                    </FormControl>
                    <FormMessage />
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

export default CategoryForm;
