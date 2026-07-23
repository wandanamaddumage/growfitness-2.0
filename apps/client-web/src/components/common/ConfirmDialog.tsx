import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  variant?: 'default' | 'destructive';
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  variant = 'default',
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-2 border-[var(--gf-green-deep)] bg-[var(--gf-paper)] shadow-2xl rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-extrabold uppercase tracking-wider text-[var(--gf-green-deep)]" style={{ fontFamily: 'var(--font-display)' }}>{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-[var(--fg-2)] font-semibold">{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-xl px-4 py-2 text-sm text-[var(--gf-green-deep)] font-extrabold uppercase tracking-wider border-2 border-[var(--gf-green-deep)] hover:bg-[var(--fg-6)] transition-all duration-200">{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            data-variant={variant}
            className="rounded-xl px-4 py-2 text-sm text-white font-extrabold uppercase tracking-wider bg-[var(--gf-green-deep)] border-2 border-[var(--gf-green-deep)] shadow-[2px_2px_0_0_var(--gf-green-deep)] data-[variant=destructive]:bg-red-600 data-[variant=destructive]:border-red-600 data-[variant=destructive]:shadow-[2px_2px_0_0_red-600] hover:translate-y-[-1px] hover:shadow-[3px_3px_0_0_var(--gf-green-deep)] data-[variant=destructive]:hover:shadow-[3px_3px_0_0_red-600] active:translate-y-[1px] active:shadow-[0_0_0_0_var(--gf-green-deep)] data-[variant=destructive]:active:shadow-[0_0_0_0_red-600] transition-all duration-200"
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
