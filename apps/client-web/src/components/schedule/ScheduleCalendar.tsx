import type { ReactNode } from 'react';
import {
  addWeeks,
  endOfWeek,
  format,
  startOfWeek,
  isSameDay,
} from 'date-fns';
import type { Session } from '@grow-fitness/shared-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEK_VIEW_START_HOUR = 6;
const WEEK_VIEW_END_HOUR = 22;

export type ScheduleCalendarEvent = {
  _id: string;
  title: string;
  date: Date;
  session: Session;
};

export type ScheduleView = 'month' | 'week';

type ScheduleCalendarProps = {
  view: ScheduleView;
  currentDate: Date;
  events: ScheduleCalendarEvent[];
  onDateChange: (date: Date) => void;
  onViewChange: (view: ScheduleView) => void;
  onEventClick: (session: Session) => void;
  actions?: ReactNode;
};

function getMonthGrid(currentDate: Date): (Date | null)[] {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays: (Date | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(new Date(year, month, i));
  }
  return calendarDays;
}

function getWeekDays(currentDate: Date): Date[] {
  const start = startOfWeek(currentDate, { weekStartsOn: 0 });
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    days.push(new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
  }
  return days;
}

function getTimeSlots(): { hour: number; label: string }[] {
  const slots: { hour: number; label: string }[] = [];
  for (let h = WEEK_VIEW_START_HOUR; h < WEEK_VIEW_END_HOUR; h++) {
    slots.push({
      hour: h,
      label: format(new Date(2000, 0, 1, h, 0), 'ha'),
    });
  }
  return slots;
}

function getTitle(view: ScheduleView, currentDate: Date): string {
  if (view === 'month') {
    return currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  }
  const start = startOfWeek(currentDate, { weekStartsOn: 0 });
  const end = endOfWeek(currentDate, { weekStartsOn: 0 });
  return `${format(start, 'MMM d')} – ${format(end, 'd, yyyy')}`;
}

export function ScheduleCalendar({
  view,
  currentDate,
  events,
  onDateChange,
  onViewChange,
  onEventClick,
  actions,
}: ScheduleCalendarProps) {
  const handlePrev = () => {
    if (view === 'month') {
      onDateChange(
        new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
      );
    } else {
      onDateChange(addWeeks(currentDate, -1));
    }
  };

  const handleNext = () => {
    if (view === 'month') {
      onDateChange(
        new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
      );
    } else {
      onDateChange(addWeeks(currentDate, 1));
    }
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  const title = getTitle(view, currentDate);

  return (
    <Card className="border-[#23B685]/20 shadow-sm">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="flex items-center text-base font-semibold">
          <CalendarIcon className="mr-2 h-5 w-5 text-[#23B685]" />
          {title}
        </CardTitle>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-md border border-input bg-muted/30 p-0.5">
            <Button
              size="sm"
              variant={view === 'month' ? 'secondary' : 'ghost'}
              className="rounded"
              onClick={() => onViewChange('month')}
            >
              Month
            </Button>
            <Button
              size="sm"
              variant={view === 'week' ? 'secondary' : 'ghost'}
              className="rounded"
              onClick={() => onViewChange('week')}
            >
              Week
            </Button>
          </div>

          <Button size="sm" variant="ghost" onClick={handlePrev}>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button size="sm" variant="ghost" onClick={handleToday}>
            {view === 'week' ? 'This week' : 'Today'}
          </Button>

          <Button size="sm" variant="ghost" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>

          {actions}
        </div>
      </CardHeader>

      <CardContent>
        {view === 'month' ? (
          <MonthView
            currentDate={currentDate}
            events={events}
            onEventClick={onEventClick}
          />
        ) : (
          <WeekView
            currentDate={currentDate}
            events={events}
            onEventClick={onEventClick}
          />
        )}
      </CardContent>
    </Card>
  );
}

function MonthView({
  currentDate,
  events,
  onEventClick,
}: {
  currentDate: Date;
  events: ScheduleCalendarEvent[];
  onEventClick: (session: Session) => void;
}) {
  const calendarDays = getMonthGrid(currentDate);

  return (
    <div className="grid grid-cols-7 gap-[1px] bg-muted rounded-lg overflow-hidden text-xs">
      {WEEKDAY_LABELS.map(day => (
        <div key={day} className="p-2 text-center font-medium bg-muted/50">
          {day}
        </div>
      ))}

      {calendarDays.map((day, idx) => {
        const dayEvents = events.filter(
          e => day && e.date.toDateString() === day.toDateString()
        );

        return (
          <div key={idx} className="min-h-[100px] p-2 bg-white">
            <div className="text-xs text-muted-foreground mb-1">
              {day?.getDate()}
            </div>

            {dayEvents.map(event => (
              <div
                key={event._id}
                onClick={() => onEventClick(event.session)}
                className="cursor-pointer mb-1 rounded bg-primary/15 p-1 text-primary truncate"
              >
                {event.title}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

function WeekView({
  currentDate,
  events,
  onEventClick,
}: {
  currentDate: Date;
  events: ScheduleCalendarEvent[];
  onEventClick: (session: Session) => void;
}) {
  const weekDays = getWeekDays(currentDate);
  const timeSlots = getTimeSlots();
  const slotHeight = 48;

  return (
    <div className="max-h-[60vh] overflow-auto rounded-lg border border-border">
      <div className="grid text-xs min-w-[600px]">
        {/* Header: empty corner + day labels */}
        <div className="grid sticky top-0 z-10 bg-muted/80 backdrop-blur grid-cols-[56px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b border-border">
          <div className="p-2 border-r border-border" />
          {weekDays.map(day => (
            <div
              key={day.toISOString()}
              className="p-2 text-center font-medium border-r border-border last:border-r-0"
            >
              <div className="text-muted-foreground">{WEEKDAY_LABELS[day.getDay()]}</div>
              <div>{format(day, 'd')}</div>
            </div>
          ))}
        </div>

        {/* Time rows */}
        {timeSlots.map(({ hour, label }) => (
          <div
            key={hour}
            className="grid grid-cols-[56px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b border-border last:border-b-0"
            style={{ minHeight: slotHeight }}
          >
            <div className="p-1 text-muted-foreground text-[10px] border-r border-border flex-shrink-0">
              {label}
            </div>

            {weekDays.map(day => {
              const slotStart = new Date(day);
              slotStart.setHours(hour, 0, 0, 0);
              const slotEnd = new Date(day);
              slotEnd.setHours(hour + 1, 0, 0, 0);

              const slotEvents = events.filter(e => {
                const d = e.date;
                if (!isSameDay(d, day)) return false;
                const time = d.getHours() * 60 + d.getMinutes();
                const slotStartMinutes = hour * 60;
                const slotEndMinutes = (hour + 1) * 60;
                return time >= slotStartMinutes && time < slotEndMinutes;
              });

              return (
                <div
                  key={day.toISOString()}
                  className="p-0.5 border-r border-border last:border-r-0 bg-white"
                >
                  {slotEvents.map(event => (
                    <button
                      key={event._id}
                      type="button"
                      onClick={() => onEventClick(event.session)}
                      className="w-full text-left cursor-pointer rounded bg-primary/15 px-1.5 py-1 text-primary truncate text-[11px] hover:bg-primary/25"
                    >
                      <span className="block truncate">{event.title}</span>
                      <span className="text-muted-foreground text-[10px]">
                        {format(event.date, 'h:mm a')}
                      </span>
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
