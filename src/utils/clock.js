// TODAY follows the current date; an explicitly selected weekday stays selected.
export const scheduleDay = (selection, now) => selection === 'today' ? now.getDay() : selection;

export function millisecondsUntilMidnight(now) {
  const next = new Date(now);
  next.setHours(24, 0, 0, 0);
  return next.getTime() - now.getTime();
}
