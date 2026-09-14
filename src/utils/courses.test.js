import {test} from 'node:test';
import assert from 'node:assert/strict';
import {migrateStore,readStore,saveStore} from './store.js';
import {saveCourse,archiveCourse,courseSchedule,courseError,defaultCourses} from '../data/courses.js';
import {upcomingExams} from './exams.js';
test('rename and reschedule preserve course identity and every related record through reload', () => {
 const old={tasks:[{id:'t',category:'school',projectId:'course-7'}],exams:[{id:'e',courseId:'course-7'}],details:{'course-7':{notes:'notes',legacy:'keep'}},unknown:{keep:true}};
 let data=migrateStore({...old,courses:structuredClone(defaultCourses)});
 data=saveCourse(data,{id:'ignored',name:'Digital VFX',sessions:[{day:3,start:'13:10',end:'16:00'}]},'course-7');
 assert.equal(data.courses.find(c=>c.id==='course-7').name,'Digital VFX');
 assert.deepEqual(courseSchedule(data.courses).find(s=>s.courseId==='course-7'),{courseId:'course-7',day:3,start:'13:10',end:'16:00'});
 for(const key of Object.keys(old)) assert.equal(data[key],old[key]);
 let raw;assert.equal(saveStore(data,()=>({setItem:(k,v)=>raw=v})),true);
 assert.deepEqual(readStore({getItem:()=>raw}),data);
 data=archiveCourse(data,'course-7');assert.ok(!courseSchedule(data.courses).some(s=>s.courseId==='course-7'));
 for(const key of Object.keys(old)) assert.equal(data[key],old[key]);
 assert.ok(courseSchedule(archiveCourse(data,'course-7',false).courses).some(s=>s.courseId==='course-7'));
});
test('new courses have unique stable IDs; empty and archived course lists do not reseed',()=>{
 let data=migrateStore({tasks:[],exams:[],details:{},courses:[]});
 assert.deepEqual(data.courses,[]);
 const form={name:'New',sessions:[{day:0,start:'00:10',end:'23:59'}]};
 data=saveCourse(saveCourse(data,form),form);assert.notEqual(data.courses[0].id,data.courses[1].id);
 data=archiveCourse(data,data.courses[0].id);assert.deepEqual(migrateStore(JSON.parse(JSON.stringify(data))),data);
 assert.ok(courseError({...form,sessions:[{day:1,start:'12:00',end:'09:00'}]}));
 assert.throws(()=>migrateStore({...data,courses:null}));
 assert.throws(()=>migrateStore({...data,courses:[data.courses[0],data.courses[0]]}));
});
test('exam reminder windows change across midnight',()=>{
 const exams=[{examDate:'2026-09-18',reminderDays:3},{examDate:'2026-09-15',reminderDays:3},{examDate:'2026-10-20',reminderDays:14}];
 assert.equal(upcomingExams(exams,new Date(2026,8,14,23,59)).length,1);
 assert.equal(upcomingExams(exams,new Date(2026,8,15)).length,2);
});
