import {courseError} from '../data/courses.js';
export const STORAGE_KEY = 'my-space.v1';
// A failed write never resets React state or removes the previously saved value.
// Resolve storage inside try: browsers can throw when accessing localStorage itself.
export function saveStore(data, getStorage = () => window.localStorage) {
  try {
    getStorage().setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch { return false; }
}
// Add missing fields without modifying tasks, detail fields or unknown data.
export function migrateStore(data) {
  if (!data || !Array.isArray(data.tasks) || !data.details || typeof data.details !== 'object' || Array.isArray(data.details) || (data.exams !== undefined && !Array.isArray(data.exams))) throw new Error('Invalid saved data');
  if (data.courses !== undefined && (!Array.isArray(data.courses) || data.courses.some(c => !c || typeof c.id !== 'string' || !c.id || c.category !== 'school' || courseError(c)) || new Set(data.courses.map(c => c.id)).size !== data.courses.length)) throw new Error('Invalid saved courses');
  return { ...data, exams: data.exams ?? [], courses: data.courses ?? [] };
}
export function readStore(storage) {
  const raw = storage.getItem(STORAGE_KEY);
  return raw === null ? migrateStore({ tasks: [], details: {}, exams: [] }) : migrateStore(JSON.parse(raw));
}

// Display fallback does not migrate or overwrite any saved fields.
export const displaySpaceName = value => typeof value === 'string' && value.trim() ? value.trim() : 'MY SPACE';
