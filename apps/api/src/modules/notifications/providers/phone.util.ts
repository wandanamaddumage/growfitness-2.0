/**
 * Normalizes a phone number to E.164 format.
 * Currently supports Sri Lankan numbers (0... -> +94...)
 * and ensures the result starts with a + followed by digits.
 */
export function normalizeToE164(phone: string): string | null {
  if (!phone) return null;

  // Remove all non-digit characters except '+'
  let cleaned = phone.trim().replace(/[^\d+]/g, '');

  // Handle local Sri Lankan format (0... -> +94...)
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    cleaned = '+94' + cleaned.substring(1);
  }

  // If it starts with a number but no '+', assume it might need '+' if it starts with 94
  if (!cleaned.startsWith('+') && cleaned.startsWith('94') && (cleaned.length === 11 || cleaned.length === 12)) {
    cleaned = '+' + cleaned;
  }

  // Basic E.164 validation (must start with + and have 10-15 digits)
  const e164Regex = /^\+\d{10,15}$/;
  return e164Regex.test(cleaned) ? cleaned : null;
}
