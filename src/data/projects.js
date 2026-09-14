import {defaultCourses} from './courses.js';
export const categories = { school: 'SCHOOL', freelance: 'FREELANCE', classRep: 'CLASS REP', personal: 'PERSONAL' };
export const otherProjects = [{id:'game',name:'遊戲場景設計',category:'freelance'},{id:'rep',name:'班代開會',category:'classRep'}];
// Compatibility exports for default fixtures; live UI uses PlannerContext.
export const courses = defaultCourses;
export const projects = [...courses, ...otherProjects];
