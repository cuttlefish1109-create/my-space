import {test} from 'node:test';
import assert from 'node:assert/strict';
import {activeCourseData,saveCourse} from '../data/courses.js';
import {migrateStore} from './store.js';
test('active projection hides archived courses and school records without mutating persisted resources',()=>{
 const course={id:'active',category:'school',name:'A',sessions:[{day:1,start:'09:00',end:'10:00'}]};
 const data={courses:[course,{...course,id:'gone',archived:true}],tasks:[{id:'a',category:'school',projectId:'active'},{id:'b',category:'school',projectId:'gone'},{id:'c',category:'personal'},{id:'d',category:'freelance',projectId:'game'},{id:'e',category:'classRep',projectId:'rep'}],exams:[{courseId:'active'},{courseId:'gone'}],details:{gone:{notes:'keep'}},spaceName:'Keep'};
 const before=structuredClone(data), visible=activeCourseData(data);
 assert.deepEqual(visible.courses.map(c=>c.id),['active']);assert.deepEqual(visible.tasks.map(t=>t.id),['a','c','d','e']);assert.deepEqual(visible.exams,[{courseId:'active'}]);assert.deepEqual(data,before);assert.equal(visible.details,data.details);
});
test('legacy multi-session load is unchanged; explicit single-session edit keeps ID and original times',()=>{
 const sessions=[{day:1,start:'09:00',end:'10:00'},{day:3,start:'13:00',end:'14:00'}];
 const old={tasks:[],exams:[],details:{x:{notes:'keep'}},courses:[{id:'x',category:'school',name:'Old',sessions}]};
 assert.deepEqual(migrateStore(old),old);
 const edited=saveCourse(old,{name:'New',sessions:[{day:5,start:'15:00',end:'16:00'}]},'x');
 assert.equal(edited.courses[0].id,'x');assert.equal(edited.courses[0].sessions.length,1);assert.deepEqual(edited.courses[0].legacySessions,sessions);assert.equal(edited.details,old.details);
 assert.throws(()=>saveCourse(old,{name:'New',sessions}));
});
