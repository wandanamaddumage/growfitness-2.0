import { useEffect } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  useGoogleCalendarSync,
  type GoogleCalendarOAuthResult,
} from '@/hooks/useGoogleCalendarSync';
import { cn } from '@/lib/utils';

type GoogleCalendarSyncButtonProps = {
  /** When false, renders nothing. Use with isGmailAccount(email). */
  enabled?: boolean;
  className?: string;
  onOAuthResult?: (result: GoogleCalendarOAuthResult) => void;
};

/** Admin-style toggle: Sync with Google Calendar / Disconnect Google Calendar. */
export function GoogleCalendarSyncButton({
  enabled = true,
  className,
  onOAuthResult,
}: GoogleCalendarSyncButtonProps) {
  const { connected, loading, busy, oauthResult, connect, disconnect, clearOAuthResult } =
    useGoogleCalendarSync({ enabled });

  useEffect(() => {
    if (!oauthResult || !onOAuthResult) {
      return;
    }
    onOAuthResult(oauthResult);
    clearOAuthResult();
  }, [oauthResult, onOAuthResult, clearOAuthResult]);

  if (!enabled) {
    return null;
  }

  const handleClick = () => {
    if (connected) {
      void disconnect();
    } else {
      void connect();
    }
  };

  return (
    <div className={cn('flex items-center justify-end gap-2', className)}>
      <Button
        type="button"
        variant={connected ? 'outline' : 'default'}
        onClick={handleClick}
        disabled={loading || busy}
        className="bg-[var(--gf-green)] text-sm text-white hover:bg-[var(--gf-green)]/90 font-bold border-2 border-[var(--gf-green-deep)] shadow-[2px_2px_0_0_var(--gf-green-deep)] hover:translate-y-[-1px] hover:shadow-[3px_3px_0_0_var(--gf-green-deep)] active:translate-y-[1px] active:shadow-[0_0_0_0_var(--gf-green-deep)] rounded-xl transition-all duration-120 h-9 w-full sm:w-auto"
      >
        <CalendarIcon className="h-4 w-4" />
        {connected ? 'Disconnect Google Calendar' : 'Sync with Google Calendar'}
      </Button>
    </div>
  );
}
