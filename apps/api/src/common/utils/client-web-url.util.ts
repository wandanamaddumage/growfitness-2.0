/** Local default for parent/coach app (Vite client-web). */
export const DEFAULT_CLIENT_WEB_URL = 'http://localhost:5173';

/**
 * Base URL for links emailed to parents/coaches (reset password, coach login, etc.).
 * Prefer CLIENT_WEB_URL; FRONTEND_URL is supported as a legacy alias.
 */
export function resolveClientWebUrl(
  clientWebUrl?: string,
  legacyFrontendUrl?: string
): string {
  const candidates = [clientWebUrl, legacyFrontendUrl].map(v => v?.trim()).filter(Boolean) as string[];
  const raw = candidates[0] ?? DEFAULT_CLIENT_WEB_URL;
  return raw.replace(/\/$/, '');
}
