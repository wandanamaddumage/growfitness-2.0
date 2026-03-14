import { useMemo, useState } from 'react';
import type { PaginatedResponse, Session } from '@grow-fitness/shared-types';
import { startOfWeek, endOfWeek } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

import { sessionsService } from '@/services/sessions.service';
import SessionDetailsModal from '@/components/common/SessionDetailsModal';
import { useApiQuery } from '@/hooks/useApiQuery';
import { useKid } from '@/contexts/kid/useKid';
import BookSessionModal from './BookSessionModal';
import {
  ScheduleCalendar,
  type ScheduleCalendarEvent,
  type ScheduleView,
} from '@/components/schedule/ScheduleCalendar';

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

export default function ScheduleTab() {
  const { selectedKid } = useKid();

  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ScheduleView>('month');
  const [openBooking, setOpenBooking] = useState(false);

  /* ---------------- Date range (month or week) ---------------- */

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

  /* ---------------- Fetch Sessions ---------------- */

  const { data: sessionsData } = useApiQuery<PaginatedResponse<Session>>(
    ['sessions', selectedKid?.id || '', startDate, endDate],
    () => {
      if (!selectedKid?.id) {
        return Promise.resolve({
          data: [],
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
        });
      }

      return sessionsService.getSessions(1, 50, {
        kidId: selectedKid.id,
        startDate,
        endDate,
      });
    },
    { enabled: Boolean(selectedKid?.id) }
  );

  /* ---------------- Map Events ---------------- */

  const events: ScheduleCalendarEvent[] = useMemo(() => {
    const sessions: Session[] = sessionsData?.data ?? [];
    return sessions.map(session => ({
      _id: session.id,
      title: getSessionLabel(session),
      date: new Date(session.dateTime),
      session,
    }));
  }, [sessionsData]);

  return (
    <>
      <ScheduleCalendar
        view={view}
        currentDate={currentDate}
        events={events}
        onDateChange={setCurrentDate}
        onViewChange={setView}
        onEventClick={setSelectedSession}
        actions={
          selectedKid?.sessionType === 'INDIVIDUAL' ? (
            <Button size="sm" onClick={() => setOpenBooking(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Book Extra Session
            </Button>
          ) : undefined
        }
      />

      <SessionDetailsModal
        open={Boolean(selectedSession)}
        session={selectedSession || undefined}
        onClose={() => setSelectedSession(null)}
        kidId={selectedKid?.id}
        onReschedule={() => {}}
      />

      {selectedKid?.sessionType === 'INDIVIDUAL' && (
        <BookSessionModal
          open={openBooking}
          onClose={() => setOpenBooking(false)}
        />
      )}
    </>
  );
}
