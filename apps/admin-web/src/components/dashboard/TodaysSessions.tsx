import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApiQuery } from '@/hooks/useApiQuery';
import { sessionsService } from '@/services/sessions.service';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { SessionSpecialBadges } from '@/components/sessions/SessionSpecialBadges';
import { formatDateTime, formatSessionType } from '@/lib/formatters';
import { Calendar } from 'lucide-react';
import { Session } from '@grow-fitness/shared-types';

export function TodaysSessions() {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
  const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

  const { data, isLoading, error } = useApiQuery(['sessions', 'today', startOfDay, endOfDay], () =>
    sessionsService.getSessions(1, 10, {
      startDate: startOfDay,
      endDate: endOfDay,
    })
  );

  if (isLoading) {
    return (
      <Card className="border-2 border-[var(--gf-green-deep)] shadow-[4px_4px_0_0_var(--gf-green-deep)] bg-[var(--gf-paper)] rounded-2xl overflow-hidden">
        <CardHeader className="bg-[var(--gf-green-50)]/40 border-b border-[var(--line)]">
          <CardTitle className="text-lg font-extrabold uppercase tracking-wider text-[var(--gf-green-deep)]" style={{ fontFamily: 'var(--font-display)' }}>Today's Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <LoadingSpinner />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-2 border-[var(--gf-green-deep)] shadow-[4px_4px_0_0_var(--gf-green-deep)] bg-[var(--gf-paper)] rounded-2xl overflow-hidden">
        <CardHeader className="bg-[var(--gf-green-50)]/40 border-b border-[var(--line)]">
          <CardTitle className="text-lg font-extrabold uppercase tracking-wider text-[var(--gf-green-deep)]" style={{ fontFamily: 'var(--font-display)' }}>Today's Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorState title="Failed to load sessions" />
        </CardContent>
      </Card>
    );
  }

  const sessions = data?.data || [];

  return (
    <Card className="border-2 border-[var(--gf-green-deep)] shadow-[4px_4px_0_0_var(--gf-green-deep)] bg-[var(--gf-paper)] rounded-2xl overflow-hidden">
      <CardHeader className="bg-[var(--gf-green-50)]/40 border-b border-[var(--line)]">
        <CardTitle className="text-lg font-extrabold uppercase tracking-wider text-[var(--gf-green-deep)]" style={{ fontFamily: 'var(--font-display)' }}>Today's Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No sessions today"
            description="There are no sessions scheduled for today."
          />
        ) : (
          <div className="space-y-2">
            {sessions.slice(0, 5).map((session: Session) => {
              const locationName = session.location?.name || 'Unknown Location';
              const kidNames = Array.isArray(session.kids)
                ? session.kids
                    .map((k: any) => (typeof k === 'object' ? k.name : 'Unknown'))
                    .filter(Boolean)
                    .join(', ')
                : 'No students';

              return (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3 border-2 border-[var(--line)] rounded-xl hover:bg-[var(--gf-green-50)]/40 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-extrabold truncate flex flex-wrap items-center gap-2 text-[var(--gf-green-deep)]">
                      <span className="truncate">{session.title || formatDateTime(session.dateTime)}</span>
                      <SessionSpecialBadges session={session} />
                    </p>
                    <p className="text-sm text-[var(--fg-2)] font-semibold truncate">
                      {locationName} • {kidNames}
                    </p>
                    <p className="text-xs text-[var(--fg-3)] font-medium mt-1">
                      {session.title ? formatDateTime(session.dateTime) : ''}{' '}
                      {formatSessionType(session.type)} •{' '}
                      {session.duration} min
                    </p>
                  </div>
                </div>
              );
            })}
            {sessions.length > 5 && (
              <p className="text-sm text-[var(--fg-2)] font-semibold text-center">
                +{sessions.length - 5} more sessions
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
