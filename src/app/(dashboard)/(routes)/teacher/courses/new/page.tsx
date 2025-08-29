'use client';

import React, { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertProvider } from '@/components/provider/alert-provider';

const formSchema = z.object({
  title: z.string().min(2, { message: 'Title must be at least 2 characters long' }).max(250),
});

function NewCourse() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const [alert, setAlert] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      router.push(`/teacher/courses/${data.id}`);
    } catch (e) {
      setAlert(true);
    }
  }

  return (
    <div className={'mx-auto flex h-full max-w-5xl flex-col p-6 md:items-center md:justify-center'}>
      <div>
        <h1 className={'text-2xl'}>Give a name to your course</h1>
        <p className={'text-sm text-muted-foreground'}>What will your students call this course?</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-8" onClick={() => setAlert(false)}>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CourseTitle</FormLabel>
                <FormControl>
                  <Input disabled={isSubmitting} placeholder="e.g. 'React for beginners'" {...field} />
                </FormControl>
                <FormDescription>What will you teach in this course.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className={'flex items-center gap-x-2'}>
            <Link href={'/'}>
              <Button type="button" variant={'secondary'}>
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={!isValid || isSubmitting} variant={'default'}>
              Continue
            </Button>
          </div>
        </form>
      </Form>
      <div className={'inset-0 flex items-start justify-center p-4'}>
        {alert && (
          <AlertProvider title="Error" description="Something went wrong" variant="destructive" iconType="error" />
        )}
      </div>
    </div>
  );
}

export default NewCourse;
