import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scheduleDay, millisecondsUntilMidnight } from './clock.js';
import { schedule } from '../data/schedule.js';

test('TODAY moves from Sunday to Monday without changing the selection', () => {
  const before = new Date(2026, 8, 13, 23, 59, 59, 900);
  const after = new Date(2026, 8, 14, 0, 0, 0);
  assert.equal(millisecondsUntilMidnight(before), 100);
  assert.equal(schedule.filter(c => c.day === scheduleDay('today', before)).length, 0);
  assert.equal(schedule.filter(c => c.day === scheduleDay('today', after)).length, 3);
  assert.equal(scheduleDay(5, after), 5);
});
test('midnight timer handles month and year changes', () => {
  assert.equal(millisecondsUntilMidnight(new Date(2026, 11, 31, 23, 59, 59)), 1000);
  assert.equal(millisecondsUntilMidnight(new Date(2026, 8, 30, 23, 59, 0)), 60000);
  assert.ok(millisecondsUntilMidnight(new Date(2027, 0, 1)) > 0);
});
