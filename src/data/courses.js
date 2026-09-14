// Legacy/example timetable only; never used to initialize user storage.
export const defaultCourses = [
  ['互動媒體整合', [[1,'09:10','12:00']]],
  ['生活木器', [[1,'13:10','16:00']]],
  ['數位創意創業思維', [[1,'17:10','19:00']]],
  ['創意生活整合設計', [[2,'13:10','16:00'],[5,'09:10','12:00']]],
  ['創意生活產業實習', [[3,'08:10','10:10']]],
  ['微拍攝與輕剪輯', [[3,'15:10','17:00']]],
  ['數位特效設計', [[4,'09:10','12:00']]],
  ['商用空間設計', [[4,'13:10','16:00']]],
  ['職場英文', [[5,'15:10','17:00']]],
].map(([name, sessions], i) => ({id:`course-${i+1}`, name, category:'school', sessions:sessions.map(([day,start,end]) => ({day,start,end}))}));

export function courseError(course) {
  if (!course.name?.trim()) return '請填寫課程名稱。';
  if (!Array.isArray(course.sessions) || !course.sessions.length) return '至少需要一個上課時段。';
  for (const s of course.sessions) {
    if (!Number.isInteger(s.day) || s.day < 0 || s.day > 6 || !/^([01]\d|2[0-3]):[0-5]\d$/.test(s.start) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(s.end) || s.start >= s.end) return '請設定有效的星期與時間，結束時間必須晚於開始時間。';
  }
  return '';
}
export const courseSchedule = courses => courses.filter(c => !c.archived).flatMap(c => c.sessions.map(s => ({...s, courseId:c.id}))).sort((a,b) => a.day-b.day || a.start.localeCompare(b.start));
export function saveCourse(data, form, id) {
  const error = courseError(form) || (form.sessions.length !== 1 ? '每堂課只設定一個上課時段。' : '');
  if (error) throw new Error(error);
  const fields = {name:form.name.trim(), sessions:form.sessions.map(s => ({...s}))};
  return {...data, courses:id ? data.courses.map(c => c.id === id ? {...c,...(c.sessions.length > 1 && !c.legacySessions ? {legacySessions:c.sessions.map(s=>({...s}))} : {}),...fields} : c) : [...data.courses, {...fields,id:crypto.randomUUID(),category:'school'}]};
}
// Soft deletion preserves IDs, detail data, tasks, exams and IndexedDB records.
export const archiveCourse = (data, id, archived = true) => ({...data,courses:data.courses.map(c => c.id === id ? {...c,archived} : c)});

// Read-only UI projection; the persisted store retains archived records and resources.
export function activeCourseData(data) {
  const courses=data.courses.filter(c=>!c.archived);
  const activeIds=new Set(courses.map(c=>c.id));
  const archivedIds=new Set(data.courses.filter(c=>c.archived).map(c=>c.id));
  return {...data,courses,tasks:data.tasks.filter(t=>!(t.category==='school' && archivedIds.has(t.projectId))),exams:data.exams.filter(e=>activeIds.has(e.courseId))};
}
