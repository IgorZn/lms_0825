'use client';

import React, { useState } from 'react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { courseFormPATCH } from '../lib/api-calls';
import { cn } from '@/lib/utils';
import { Course } from '@prisma/client';
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/app/(dashboard)/(routes)/teacher/courses/[courseId]/lib/format';

interface PriceFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  price: z.number().positive({ message: 'Price must be positive' }),
});

function PriceForm({ initialData, courseId }: PriceFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { price: initialData.price ?? 0 },
  });

  const toggleEdit = () => setIsEditing(prev => !prev);
  const { isSubmitting, isValid } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await courseFormPATCH(courseId, values);
      toast.success(<div className={'text-green-700'}>Course description updated successfully</div>, {
        duration: 1000,
      });
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error(<div className={'text-red-500'}>Something went wrong</div>);
    }
  }

  return (
    <div className={'mt-6 rounded-md border bg-slate-50 p-4'}>
      <div className={'flex items-center justify-between font-medium'}>
        Current price
        {!isEditing && (
          <p className={cn('text-sm font-light', !initialData.price && 'italic text-slate-500')}>
            {(initialData.price && formatPrice(initialData.price as number)) || 'No price provided'}
          </p>
        )}
        <Button type="submit" variant={'ghost'} onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className={'mr-2 h-4 w-4'} />
              Change price
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
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type={''}
                        step={'0.01'}
                        disabled={isSubmitting}
                        placeholder="Set price"
                        className="resize-none bg-white"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
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

export default PriceForm;
