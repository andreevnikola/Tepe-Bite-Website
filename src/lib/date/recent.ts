/**
 * Whether an ISO date is within the last `days` (default 14) — used for the
 * "New" badge on news cards. Reads the wall clock, so it lives outside React
 * component render (calling `Date.now()` during render is flagged as impure).
 */
export function isRecent(iso: string, days = 14): boolean {
  return Date.now() - new Date(iso).getTime() < days * 24 * 60 * 60 * 1000;
}
