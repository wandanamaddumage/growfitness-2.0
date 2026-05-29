import type { Session } from '@grow-fitness/shared-types';

/** Free-session booking hides sessions that already have more than this many kids assigned. */
export const FREE_SESSION_MAX_KIDS = 25;

export function getSessionAssignedKidCount(session: Session): number {
  return session.kids?.length ?? 0;
}

/** Upcoming free sessions eligible for public booking (not full). */
export function isSelectableFreeSession(session: Session, now: Date = new Date()): boolean {
  if (!session?.dateTime) {
    return false;
  }
  if (new Date(session.dateTime).getTime() <= now.getTime()) {
    return false;
  }
  return getSessionAssignedKidCount(session) <= FREE_SESSION_MAX_KIDS;
}

export function filterSelectableFreeSessions(
  sessions: Session[],
  now: Date = new Date()
): Session[] {
  return sessions
    .filter(session => isSelectableFreeSession(session, now))
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
}
