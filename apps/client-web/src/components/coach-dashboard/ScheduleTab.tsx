import { useMemo, useState } from 'react';
import { startOfWeek, endOfWeek } from 'date-fns';
import { sessionsService } from '@/services/sessions.service';
import type { Session } from '@grow-fitness/shared-types';
import SessionDetailsModal from '@/components/common/SessionDetailsModal';
import { useApiQuery } from '@/hooks/useApiQuery';
import { useAuth } from '@/contexts/useAuth';
import {
  ScheduleCalendar,
  type ScheduleCalendarEvent,
  type ScheduleView,
} from '@/components/schedule/ScheduleCalendar';

/* ------------------------------------------------------------------ */
/* Helpers */
/* ------------------------------------------------------------------ */

const getSessionLabel = (session: Session): string => {
  switch (session.type) {
    case 'INDIVIDUAL':
      return 'Individual Session';
    case 'GROUP':
      return 'Group Session';
    default:
      return 'Session';
  }
};

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

export default function ScheduleTab() {
  const { user } = useAuth();
  const coachId = user?.id;

  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ScheduleView>('month');

  /* ------------------------------------------------------------------
   * Date range (month or week)
   * ------------------------------------------------------------------ */

  const [startDate, endDate] = useMemo(() => {
    if (view === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 0 });
      const end = endOfWeek(currentDate, { weekStartsOn: 0 });
      return [start.toISOString(), end.toISOString()] as const;
    }
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();
    return [
      new Date(y, m, 1).toISOString(),
      new Date(y, m + 1, 0, 23, 59, 59, 999).toISOString(),
    ] as const;
  }, [currentDate, view]);

  /* ------------------------------------------------------------------
   * Fetch sessions (coach-based)
   * ------------------------------------------------------------------ */

  const queryKey = [
    'sessions',
    coachId || '',
    startDate || '',
    endDate || '',
  ].filter(Boolean) as string[];
  const { data: sessionsData } = useApiQuery(
    queryKey,
    () => {
      if (!coachId) {
        throw new Error('Coach ID is required to fetch sessions');
      }
      return sessionsService.getSessions(1, 50, {
        coachId,
        startDate,
        endDate,
      });
    },
  {
    enabled: Boolean(coachId && startDate),
  }
);

  /* ------------------------------------------------------------------
   * Map calendar events
   * ------------------------------------------------------------------ */

  const events: ScheduleCalendarEvent[] = useMemo(() => {
    const sessions: Session[] = sessionsData?.data ?? [];
    return sessions.map(session => ({
      _id: session.id,
      title: getSessionLabel(session),
      date: new Date(session.dateTime),
      session,
    }));
  }, [sessionsData?.data]);

  /* ------------------------------------------------------------------
   * Render
   * ------------------------------------------------------------------ */

  return (
    <>
      <ScheduleCalendar
        view={view}
        currentDate={currentDate}
        events={events}
        onDateChange={setCurrentDate}
        onViewChange={setView}
        onEventClick={setSelectedSession}
      />

      <SessionDetailsModal
        open={Boolean(selectedSession)}
        session={selectedSession || undefined}
        onClose={() => setSelectedSession(null)}
      />
    </>
  );
}
