/** Small helpers for ISO date strings (YYYY-MM-DD), without time zone surprises. */

/** "2026-11-08T08:40" -> "2026-11-08" */
export function dayOf(dateTime: string): string {
  return dateTime.slice(0, 10);
}

/** addDays("2026-11-08", -1) -> "2026-11-07" */
export function addDays(day: string, amount: number): string {
  const [year, month, date] = day.split('-').map(Number);
  const result = new Date(year, month - 1, date + amount);
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${result.getFullYear()}-${pad(result.getMonth() + 1)}-${pad(result.getDate())}`;
}
