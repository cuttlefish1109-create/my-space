import { test } from 'node:test';
import assert from 'node:assert/strict';
import { migrateStore, readStore } from './store.js';
test('migration adds exams without altering existing or unknown data', () => {
  const original = { tasks: [{ id: 'old', completed: true, notes: '保留' }], details: { 'course-1': { notes: '筆記', teacher: '老師', week: 3 }, rep: { topics: '議題一\n議題二', meetingDate: '2026-09-13T10:00' } }, extra: { preserve: true } };
  const before = JSON.stringify(original);
  assert.deepEqual(migrateStore(original), { ...original, exams: [], courses: [] });
  assert.equal(JSON.stringify(original), before);
  const withExams = { ...original, exams: [{ id: 'exam', reminderDays: 14 }] };
  assert.deepEqual(migrateStore(withExams), {...withExams,courses:[]});
});
test('invalid storage is rejected rather than replaced; absent storage gets defaults', () => {
  assert.throws(() => readStore({ getItem: () => '{broken' }));
  assert.throws(() => migrateStore({ tasks: [], details: {}, exams: 'invalid' }));
  assert.deepEqual(readStore({ getItem: () => null }), { tasks: [], details: {}, exams: [], courses:[] });
});
