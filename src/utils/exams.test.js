import { test } from 'node:test';
import assert from 'node:assert/strict';
import { daysUntilExam, countdown, upcomingExams } from './exams.js';
test('reminders use calendar days and include today', () => {
  assert.equal(daysUntilExam('2026-10-20', new Date(2026, 9, 6, 23, 59)), 14);
  assert.equal(daysUntilExam('2027-01-10', new Date(2026, 11, 31)), 10);
  assert.equal(daysUntilExam('2026-03-09', new Date(2026, 2, 8)), 1);
  assert.equal(countdown(14), '14 DAYS LEFT');
  assert.equal(countdown(1), 'TOMORROW');
  assert.equal(countdown(0), 'TODAY');
  assert.equal(countdown(-1), '已結束');
});
test('upcoming exams exclude past exams and sort by date without modifying source', () => {
  const exams = [{ examDate: '2026-10-20' }, { examDate: '2026-10-05' }, { examDate: '2026-10-06' }];
  assert.deepEqual(upcomingExams(exams, new Date(2026, 9, 6)).map(e => e.examDate), ['2026-10-06', '2026-10-20']);
  assert.equal(exams[0].examDate, '2026-10-20');
});
