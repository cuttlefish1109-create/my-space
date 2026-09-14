export const localDate = (date=new Date()) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
export function sortTasks(tasks) { return [...tasks].sort((a,b)=>Number(a.completed)-Number(b.completed)||(a.deadline||'9999').localeCompare(b.deadline||'9999')||a.createdAt.localeCompare(b.createdAt)); }
export function makeTask(fields) { return {...fields,id:crypto.randomUUID(),title:fields.title.trim(),projectId:fields.projectId??null,notes:fields.notes??'',completed:false,createdAt:new Date().toISOString()}; }

export const tasksForCourse = (tasks, courseId) => tasks.filter(task => task.category === 'school' && task.projectId === courseId);

export function bindCourseTask(fields, course) {
  return course?.category === 'school'
    ? { ...fields, category: 'school', projectId: course.id }
    : fields;
}
