import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface FormSubmitErrorProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function FormSubmitError({ message, onRetry, className }: FormSubmitErrorProps) {
  return (
    <Alert variant="destructive" className={cn('rounded-lg', className)} role="alert">
      <AlertTitle className="font-medium">Something went wrong</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
      {onRetry && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3 border-destructive/50 text-destructive hover:bg-destructive/10"
          onClick={onRetry}
        >
          Try again
        </Button>
      )}
    </Alert>
  );
}
