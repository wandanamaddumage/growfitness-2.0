import type { FreeSessionFormValues } from '@/lib/free-session-form-schemas';
import type { Session } from '@grow-fitness/shared-types';
import type { QuestionConfig, QuestionOption } from '@/types/question-config';
import { sessionsService } from '@/services/sessions.service';
import { filterSelectableFreeSessions } from '@/lib/free-sessions';

interface SessionOption extends QuestionOption {
  value: string;
  label: string;
  dateTime: Date | string;
  locationId: string;
}

const fetchFreeSessions = async (): Promise<SessionOption[]> => {
  try {
    const response = await sessionsService.getFreeSessions(1, 100);
    const sessions = response?.data ?? [];

    if (!sessions.length) return [];

    const now = new Date();
    const weekEnd = new Date();
    weekEnd.setDate(now.getDate() + 7);

    const mappedOptions = filterSelectableFreeSessions(sessions)
      .filter((session: Session) => {
        const dateObj = new Date(session.dateTime);

        // only upcoming 7 days
        return dateObj >= now && dateObj <= weekEnd;
      })
      .sort(
        (a, b) =>
          new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
      )
      .map((session: Session) => {
        const startDate = new Date(session.dateTime);

        const durationMinutes = session.duration ?? 120;
        const endDate = new Date(
          startDate.getTime() + durationMinutes * 60000
        );

        // 👇 ONLY weekday name (Monday, Tuesday, etc.)
        const weekday = startDate.toLocaleDateString('en-US', {
          weekday: 'long',
        });

        const startTime = startDate.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });

        const endTime = endDate.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });

        return {
          value: session.id,
          label: `${weekday} ${startTime} – ${endTime} - ${
            session.location?.name ?? 'Location'
          }`,
          dateTime: startDate,
          locationId: session.locationId,
        };
      });

    return mappedOptions;
  } catch (error) {
    console.error('❌ ERROR FETCHING FREE SESSIONS:', error);
    return [];
  }
};

export const collectInfoQuestions: QuestionConfig<keyof FreeSessionFormValues>[] = [
  {
    id: 'parentName',
    type: 'text',
    title: "What's your full name?",
    placeholder: 'Enter your full name',
    required: true,
  },
  {
    id: 'phone',
    type: 'phone',
    title: "What's your phone number?",
    placeholder: 'Enter your phone number',
    required: true,
  },
  {
    id: 'email',
    type: 'email',
    title: "What's your email address?",
    placeholder: 'Enter your email',
    required: true,
  },
  {
    id: 'kidName',
    type: 'text',
    title: "What's your child's name?",
    placeholder: "Enter your child's name",
    required: true,
  },
  {
    id: 'selectedSessionId',
    type: 'select',
    title: 'Select Available Session',
    subtitle: 'Choose from available date, time & location',
    required: true,
    options: async () => {
      return await fetchFreeSessions();
    },
  },
];

