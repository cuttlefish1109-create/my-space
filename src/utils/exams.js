import { localDate } from './tasks.js';
const calendarDay = value => {
  const [year, month, day] = value.split('-').map(Number);
  return Date.UTC(year, month - 1, day) / 86400000;
};
// Compare calendar dates, not elapsed hours, including across DST boundaries.
export function daysUntilExam(examDate, now = new Date()) {
  return calendarDay(examDate) - calendarDay(localDate(now));
}
export function countdown(days) {
  if (days < 0) return '已結束';
  if (days === 0) return 'TODAY';
  if (days === 1) return 'TOMORROW';
  return `${days} DAYS LEFT`;
}
export function upcomingExams(exams, now = new Date()) {
  return exams.filter(exam => daysUntilExam(exam.examDate, now) >= 0 && daysUntilExam(exam.examDate, now) <= (exam.reminderDays ?? 14)).sort((a, b) => a.examDate.localeCompare(b.examDate));
}
