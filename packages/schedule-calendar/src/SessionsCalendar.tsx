import { useEffect, useRef, useState, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { EventInput, EventContentArg } from '@fullcalendar/core';
import { Session, SessionStatus, sessionIsExtraSession } from '@grow-fitness/shared-types';
import { CALENDAR_STYLES } from './calendarStyles';
import { getStatusColor } from './sessionEventUtils';

export interface SessionsCalendarProps {
  /** FullCalendar event objects. extendedProps should be Session. */
  events: EventInput[];
  onSessionClick: (session: Session) => void;
  /** Called when the calendar view or date range changes (e.g. for refetching). */
  onDatesSet?: (start: string, end: string) => void;
  loading?: boolean;
  /** Allow drag-and-drop and resize. When true, onEventDrop and onEventResize are required. */
  editable?: boolean;
  onEventDrop?: (sessionId: string, newStart: Date, durationMinutes: number) => void;
  onEventResize?: (sessionId: string, durationMinutes: number) => void;
  /** Calendar height. Default "700px". */
  height?: string;
}

// ── Breakpoints ───────────────────────────────────────────────────────────────
const MOBILE_BP = 640;
const TABLET_BP = 1024;

type DisplayStatusVariant = 'normal' | 'cancelled' | 'extra' | 'free';

function getDisplayVariant(session: Session): DisplayStatusVariant {
  if (session.status === SessionStatus.CANCELLED) return 'cancelled';
  if (sessionIsExtraSession(session)) return 'extra';
  if (session.isFreeSession) return 'free';
  return 'normal';
}

// ── Container-width hook ──────────────────────────────────────────────────────
function useContainerWidth(ref: React.RefObject<HTMLDivElement>) {
  const [width, setWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) setWidth(entry.contentRect.width);
    });
    ro.observe(ref.current);
    setWidth(ref.current.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, [ref]);
  return width;
}

// ── Unified event renderer (dot + title, all views) ───────────────────────────
function EventContent({ arg }: { arg: EventContentArg }) {
  const session = arg.event.extendedProps as Session;
  const displayVariant = getDisplayVariant(session);
  const isMonth = arg.view.type === 'dayGridMonth';
  const isTime = arg.view.type === 'timeGridWeek' || arg.view.type === 'timeGridDay';

  const dotColor = getStatusColor(session.status);
  const textColor = displayVariant === 'cancelled' ? '#9aa0a6' : '#3c4043';
  const timeColor = displayVariant === 'cancelled' ? '#9aa0a6' : (displayVariant === 'free' ? '#d97706' : displayVariant === 'extra' ? '#7e22ce' : '#1a9e72');

  return (
    <div className={`fc-custom-event ${isMonth ? 'fc-custom-event--month' : 'fc-custom-event--time'} ${displayVariant !== 'normal' ? `fc-event-${displayVariant}` : ''}`}>
      {/* Dot */}
      <span
        className="fc-custom-dot"
        style={{ backgroundColor: dotColor, flexShrink: 0 }}
      />

      {/* Content */}
      <div className="fc-custom-body">
        {/* Time — only shown in week/day views */}
        {isTime && arg.timeText && (
          <span
            className="fc-custom-time"
            style={{ color: timeColor }}
          >
            {arg.timeText}
          </span>
        )}

        {/* Title row */}
        <div className="fc-custom-title-row">
          <span
            className="fc-custom-title"
            style={{
              color: textColor,
              textDecoration: displayVariant === 'cancelled' ? 'line-through' : 'none',
            }}
          >
            {displayVariant === 'cancelled' && <span className="fc-custom-x">✕ </span>}
            {arg.event.title}
          </span>

          {/* Badges */}
          {displayVariant === 'cancelled' && (
            <span className="fc-badge fc-badge-cancelled">Cancelled</span>
          )}
          {displayVariant === 'extra' && (
            <span className="fc-badge fc-badge-extra">Extra</span>
          )}
          {displayVariant === 'free' && (
            <span className="fc-badge fc-badge-free">Free</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function SessionsCalendar({
  events,
  onSessionClick,
  onDatesSet,
  loading = false,
  editable = false,
  onEventDrop,
  onEventResize,
  height = '700px',
}: SessionsCalendarProps) {
  const calendarRef = useRef<FullCalendar>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidth = useContainerWidth(containerRef as React.RefObject<HTMLDivElement>);

  const isMobile = containerWidth < MOBILE_BP;
  const isTablet = containerWidth >= MOBILE_BP && containerWidth < TABLET_BP;

  const scrollToNow = useCallback(() => {
    const api = calendarRef.current?.getApi();
    if (!api) return;
    const hours = Math.max(6, Math.min(21, new Date().getHours()));
    api.scrollToTime(`${String(hours).padStart(2, '0')}:00:00`);
  }, []);

  useEffect(() => {
    const t = setTimeout(scrollToNow, 100);
    return () => clearTimeout(t);
  }, [scrollToNow, isMobile]);

  const handleEventClick = (info: { event: { extendedProps: unknown } }) =>
    onSessionClick(info.event.extendedProps as Session);

  const handleEventDrop = (info: { event: { id: string; start: Date | null; end: Date | null } }) => {
    const { event } = info;
    if (!event.start || !event.end || !editable || !onEventDrop) return;
    onEventDrop(event.id, event.start, Math.round((event.end.getTime() - event.start.getTime()) / 60000));
  };

  const handleEventResize = (info: { event: { id: string; end: Date | null; start: Date | null } }) => {
    const { event } = info;
    if (!event.start || !event.end || !editable || !onEventResize) return;
    onEventResize(event.id, Math.round((event.end.getTime() - event.start.getTime()) / 60000));
  };

  const handleDatesSet = (dateInfo: { startStr: string; endStr: string }) => {
    onDatesSet?.(dateInfo.startStr, dateInfo.endStr);
    setTimeout(scrollToNow, 50);
  };

  const headerToolbar = isMobile
    ? { left: 'prev,next', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' }
    : isTablet
      ? { left: 'prev,next today', center: 'title', right: 'timeGridWeek,timeGridDay' }
      : { left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' };

  const slotLabelFormat = isMobile
    ? { hour: 'numeric' as const, meridiem: 'narrow' as const }
    : { hour: 'numeric' as const, minute: '2-digit' as const, omitZeroMinute: true, meridiem: 'narrow' as const };

  const dayHeaderContent = isMobile
    ? (arg: { date: Date }) => (
      <div className="fc-col-header-cell-cushion fc-col-header-mobile">
        <span className="day-name-short">
          {arg.date.toLocaleDateString('en-US', { weekday: 'narrow' })}
        </span>
        <span className="day-number">{arg.date.getDate()}</span>
      </div>
    )
    : (arg: { date: Date }) => (
      <div className="fc-col-header-cell-cushion">
        <span className="day-name">{arg.date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
        <span className="day-number">{arg.date.getDate()}</span>
      </div>
    );

  return (
    <div
      ref={containerRef}
      className="bg-white border rounded-xl p-4 shadow-sm calendar-container text-[#3c4043] relative"
    >
      {loading && (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-[1px] rounded-xl"
          style={{ backdropFilter: 'blur(1px)' }}
        >
          <div
            style={{
              width: 32, height: 32,
              border: '2px solid #e8eaed',
              borderTopColor: '#23B685',
              borderRadius: '50%',
              animation: 'schedule-calendar-spin 0.8s linear infinite',
            }}
            aria-hidden
          />
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
${CALENDAR_STYLES}

/* ── Strip FC default event chrome ─────────────────────── */
.calendar-container .fc-event {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
  cursor: pointer;
}
.calendar-container .fc-event-main {
  padding: 0 !important;
  height: 100%;
}
/* Remove FC's built-in dot in month view */
.calendar-container .fc-daygrid-event-dot {
  display: none !important;
}
/* Remove default time text FC injects (we render our own) */
.calendar-container .fc-event-time {
  display: none !important;
}

/* ── Shared event wrapper ────────────────────────────────── */
.fc-custom-event {
  display: flex;
  align-items: flex-start;
  gap: 5px;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
}

/* Month: single-line row */
.fc-custom-event--month {
  padding: 1px 4px;
  align-items: center;
}

/* Week/Day: card with subtle bg */
.fc-custom-event--time {
  padding: 4px 6px;
  height: 100%;
  background-color: #f0fdf8;
  border-left: 3px solid #23B685;
  border-radius: 0 4px 4px 0;
}
/* Cancelled week/day card */
.fc-custom-event--time.fc-event-cancelled {
  background-color: #f8f9fa;
  border-left-color: #dadce0;
  opacity: 0.75;
}
/* Free week/day card */
.fc-custom-event--time.fc-event-free {
  background-color: #fffbeb;
  border-left-color: #f59e0b;
}
/* Extra week/day card */
.fc-custom-event--time.fc-event-extra {
  background-color: #faf5ff;
  border-left-color: #8b5cf6;
}

/* ── Dot ─────────────────────────────────────────────────── */
.fc-custom-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  margin-top: 4px;
}
.fc-custom-event--month .fc-custom-dot {
  margin-top: 0;
}

/* ── Body ────────────────────────────────────────────────── */
.fc-custom-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

/* ── Time (week/day only) ────────────────────────────────── */
.fc-custom-time {
  font-size: 10px;
  font-weight: 600;
  white-space: nowrap;
  line-height: 1.3;
}

/* ── Title row ───────────────────────────────────────────── */
.fc-custom-title-row {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
  min-width: 0;
}
.fc-custom-title {
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
}
.fc-custom-x {
  font-size: 10px;
}

/* ── Badges ─────────────────────────────────────────────── */
.fc-badge {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 0 5px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.3px;
  white-space: nowrap;
  line-height: 1.7;
  flex-shrink: 0;
}
.fc-badge-cancelled {
  background: #fce8e6;
  color: #c5221f;
}
.fc-badge-extra {
  background: #faf5ff;
  color: #7e22ce;
  border: 1px solid #8b5cf6;
}
.fc-badge-free {
  background: #fffbeb;
  color: #d97706;
  border: 1px solid #f59e0b;
}

/* ── Mobile overrides ───────────────────────────────────── */
@media (max-width: 639px) {
  .calendar-container {
    padding: 8px !important;
    border-radius: 12px !important;
  }
  .calendar-container .fc-toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 4px;
    justify-content: space-between;
    align-items: center;
  }
  .calendar-container .fc-toolbar-title {
    font-size: 14px !important;
    font-weight: 600;
    white-space: nowrap;
  }
  .calendar-container .fc-toolbar-chunk:last-child {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .calendar-container .fc-button {
    padding: 4px 10px !important;
    font-size: 12px !important;
    min-width: 0;
  }
  .calendar-container .fc-timegrid-slot-label {
    font-size: 10px !important;
    padding: 0 4px !important;
    white-space: nowrap;
  }
  .calendar-container .fc-timegrid-slot {
    height: 40px !important;
  }
  .fc-col-header-mobile {
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 1.2;
    padding: 4px 2px;
  }
  .day-name-short {
    font-size: 10px;
    font-weight: 500;
    text-transform: uppercase;
    color: #70757a;
  }
  .fc-col-header-mobile .day-number {
    font-size: 16px;
    font-weight: 600;
  }
  .calendar-container .fc-scroller {
    overflow-x: hidden !important;
  }
  /* Compact event text on mobile */
  .fc-custom-title   { font-size: 11px; }
  .fc-custom-time    { font-size: 9px; }
  .fc-badge          { font-size: 8px; padding: 0 3px; }
  .fc-custom-event--time { padding: 2px 4px; }
}

/* ── Tablet tweaks ───────────────────────────────────────── */
@media (min-width: 640px) and (max-width: 1023px) {
  .calendar-container .fc-toolbar-title { font-size: 16px !important; }
  .calendar-container .fc-timegrid-slot { height: 44px !important; }
}
` }} />

      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={isMobile ? 'timeGridDay' : 'timeGridWeek'}
        headerToolbar={headerToolbar}
        views={isMobile ? {
          dayGridMonth: { buttonText: 'Mo' },
          timeGridWeek: { buttonText: 'Wk' },
          timeGridDay: { buttonText: 'Day' },
        } : undefined}
        events={events}
        editable={editable}
        selectable={editable}
        selectMirror={editable}
        dayMaxEvents={isMobile ? 2 : true}
        weekends={true}
        height={isMobile ? 'auto' : isTablet ? '600px' : height}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
        datesSet={handleDatesSet}
        slotMinTime="06:00:00"
        slotMaxTime="22:00:00"
        slotDuration="00:30:00"
        allDaySlot={false}
        nowIndicator={true}
        scrollTime={`${String(Math.max(6, Math.min(21, new Date().getHours()))).padStart(2, '0')}:00:00`}
        slotLabelFormat={slotLabelFormat}
        longPressDelay={isMobile ? 500 : 1000}
        eventLongPressDelay={isMobile ? 500 : 1000}
        selectLongPressDelay={isMobile ? 500 : 1000}
        dayHeaderContent={dayHeaderContent}
        eventContent={(arg: EventContentArg) => <EventContent arg={arg} />}
      />
    </div>
  );
}
