import * as React from 'react';
import { cn } from '@/lib/utils';

export interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: 'error' | 'description';
}

const FormMessage = React.forwardRef<HTMLParagraphElement, FormMessageProps>(
  ({ className, variant = 'description', children, ...props }, ref) => {
    if (!children) return null;

    return (
      <p
        ref={ref}
        role={variant === 'error' ? 'alert' : undefined}
        className={cn(
          'text-sm mt-1.5',
          variant === 'error' &&
            'text-destructive font-medium',
          variant === 'description' && 'text-muted-foreground',
          className
        )}
        {...props}
      >
        {children}
      </p>
    );
  }
);
FormMessage.displayName = 'FormMessage';

export { FormMessage };
