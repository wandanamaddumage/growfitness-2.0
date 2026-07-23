import { Bell, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NotificationBubbleProps {
  visible: boolean;
  message: string;
  onDismiss: () => void;
  onOpenList?: () => void;
  className?: string;
}

export function NotificationBubble({
  visible,
  message,
  onDismiss,
  onOpenList,
  className,
}: NotificationBubbleProps) {
  if (!visible) return null;

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-[100] flex w-[380px] min-w-[380px] items-center gap-3 overflow-hidden rounded-2xl border-2 border-[var(--gf-green-deep)] bg-[var(--gf-paper)] p-3 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200',
        className
      )}
      role="alert"
    >
      {/* Icon block: same vertical rhythm as content */}
      <div className="flex shrink-0 items-center justify-center self-stretch rounded-xl bg-[var(--gf-green-deep)] px-2.5 py-2 shadow-[2px_2px_0_0_var(--gf-green-deep)]">
        <Bell className="h-5 w-5 text-white bg-[var(--gf-green-deep)]" strokeWidth={2} aria-hidden />
      </div>

      {/* Content: even padding, compact vertical spacing */}
      <div className="flex min-w-0 flex-1 flex-col gap-1 py-0.5">
        <div className="flex items-center justify-between gap-2">
          <p className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[var(--gf-green-deep)]" style={{ fontFamily: 'var(--font-display)' }}>
            <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden />
            Notifications
          </p>
          <Button
            variant="ghost"
            size="icon"
            className="-mr-1 h-7 w-7 shrink-0 rounded-full text-[var(--fg-2)] hover:bg-[var(--fg-6)] hover:text-[var(--gf-green-deep)]"
            onClick={onDismiss}
            aria-label="Dismiss notification"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
        <p className="text-sm font-extrabold leading-snug text-[var(--gf-green-deep)]">
          {message}
        </p>
        {onOpenList && (
          <Button
            variant="link"
            size="sm"
            className="h-auto w-fit p-0 text-sm font-extrabold uppercase tracking-wider text-[var(--gf-green-deep)] hover:text-[var(--gf-green-deep)] hover:underline"
            onClick={onOpenList}
          >
            View all →
          </Button>
        )}
      </div>
    </div>
  );
}