'use client';
import { AlertCircleIcon, CheckCircle2Icon, PopcornIcon } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
interface AlertProvider {
  title: string;
  description: string;
  variant: 'default' | 'destructive';
  iconType: 'error' | string;
}
export function AlertProvider({ title, description, variant = 'destructive', iconType = 'error' }: AlertProvider) {
  const getIcon = (iconType: string) => {
    const icons = {
      success: CheckCircle2Icon,
      error: AlertCircleIcon,
      info: PopcornIcon,
    };
    const IconComponent = icons[iconType as keyof typeof icons] || AlertCircleIcon;
    return <IconComponent />;
  };

  return (
    <div className="grid w-full max-w-xl items-start gap-4">
      <Alert variant={variant}>
        {getIcon(iconType)}
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>
          <p>{description}</p>
          <ul className="list-inside list-disc text-sm">
            <li>Check your card details</li>
            <li>Ensure sufficient funds</li>
            <li>Verify billing address</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
}
