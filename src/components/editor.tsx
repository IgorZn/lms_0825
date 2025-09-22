'use client';

import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { useMemo } from 'react';

interface EditorProps {
  value: string | null | undefined;
  onChange: (value: string) => void;
}

export const Editor = ({ value, onChange }: EditorProps) => {
  const Quill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }), []);
  return (
    <div className={'bg-white'}>
      <Quill theme="snow" value={value ?? ''} onChange={onChange} />
    </div>
  );
};
