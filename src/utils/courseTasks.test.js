import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bindCourseTask, makeTask, tasksForCourse } from './tasks.js';
import { schedule } from '../data/schedule.js';
import { migrateStore } from './store.js';

test('Tuesday has only integrated design; Monday woodworking remains', () => {
  assert.deepEqual(schedule.filter(s => s.day === 2), [{ day: 2, start: '13:10', end: '16:00', courseId: 'course-4' }]);
  assert.ok(schedule.some(s => s.day === 1 && s.start === '13:10' && s.end === '16:00' && s.courseId === 'course-2'));
});

test('course submission binds category and ID even if form fields are missing or changed', () => {
  const course = { id: 'course-7', category: 'school' };
  const fields = { title: 'Blender 場景作業', category: 'personal', projectId: null, deadline: '2026-09-20' };
  const task = makeTask(bindCourseTask(fields, course));
  assert.equal(task.category, 'school');
  assert.equal(task.projectId, 'course-7');
  assert.equal(fields.projectId, null);
  assert.equal(tasksForCourse([task], course.id)[0], task);
  assert.deepEqual(tasksForCourse([task], 'course-1'), []);
});

test('home tasks remain unbound and existing task IDs and extra fields survive', () => {
  for (const category of ['school', 'freelance', 'classRep', 'personal']) {
    const task = makeTask(bindCourseTask({ title: '首頁待辦', category, projectId: null }, undefined));
    assert.equal(task.projectId, null);
    assert.equal(task.category, category);
  }
  const existing = { id: 'existing-id', title: '舊待辦', category: 'school', projectId: 'course-7', createdAt: '2026-09-01', notes: '保留', completed: true };
  assert.deepEqual(bindCourseTask(existing, { id: 'course-7', category: 'school' }), existing);
});

test('course view uses the same task objects, includes completed and legacy follow-up tasks, and persists without losing records', () => {
  const course = { id: 'course-7', category: 'school' };
  const item = makeTask(bindCourseTask({ title: 'AE 特效練習', followUp: true }, course));
  const other = makeTask({ title: '其他課程', category: 'school', projectId: 'course-1' });
  const original = { tasks: [item, other], details: { 'course-7': { notes: '原筆記' } }, exams: [] };
  const reloaded = migrateStore(JSON.parse(JSON.stringify(original)));
  assert.equal(tasksForCourse(reloaded.tasks, course.id).length, 1);
  const completed = reloaded.tasks.map(t => t.id === item.id ? { ...t, completed: true } : t);
  assert.equal(tasksForCourse(completed, course.id)[0], completed[0]);
  assert.equal(tasksForCourse(completed, course.id)[0].completed, true);
  const removed = completed.filter(t => t.id !== item.id);
  assert.deepEqual(tasksForCourse(removed, course.id), []);
  assert.equal(removed[0].id, other.id);
  assert.equal(original.tasks[0].completed, false);
  assert.equal(reloaded.details['course-7'].notes, '原筆記');
});
