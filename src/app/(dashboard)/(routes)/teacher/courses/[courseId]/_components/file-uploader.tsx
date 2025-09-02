'use client';

import { UploadDropzone } from '@/utils/uploadthing';
import { OurFileRouter } from '@/app/api/uploadthing/core';
import { toast } from 'sonner';

interface FileUploaderProps {
  endpoint: keyof OurFileRouter;
  onChange: (url: string) => void;
}

export const FileUploader = ({ endpoint, onChange }: FileUploaderProps) => {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={res => onChange(res?.[0].url)}
      onUploadError={(error: Error) => {
        toast.error(<div className={'text-red-500'}>{error.message}</div>);
      }}
    />
  );
};
