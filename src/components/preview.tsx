'use client';

import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.bubble.css';
import { useMemo } from 'react';

interface PreviewProps {
  value: string;
}

export const Preview = ({ value }: PreviewProps) => {
  const Quill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }), []);
  return <Quill theme="bubble" value={value} readOnly />;
};
