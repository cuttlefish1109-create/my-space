import {test} from 'node:test';
import assert from 'node:assert/strict';
import {makeTask,sortTasks,localDate} from './tasks.js';
test('quick tasks support every category without a project',()=>{for(const category of ['personal','school','freelance','classRep']){const task=makeTask({title:' 買東西 ',category,deadline:'2026-09-16',notes:'清單'});assert.equal(task.projectId,null);assert.equal(task.title,'買東西');assert.equal(task.category,category);assert.equal(task.completed,false);assert.equal(task.notes,'清單');assert.ok(task.id);}});
test('unified list sorts deadlines, undated last and completed at bottom',()=>{const tasks=[{id:1,deadline:'',completed:false},{id:2,deadline:'2026-09-20',completed:false},{id:3,deadline:'2026-09-14',completed:true},{id:4,deadline:'2026-09-15',completed:false}].map(t=>({...t,createdAt:'2026-09-01'}));assert.deepEqual(sortTasks(tasks).map(t=>t.id),[4,2,1,3]);assert.deepEqual(tasks.map(t=>t.id),[1,2,3,4]);});
test('today uses local calendar date',()=>assert.equal(localDate(new Date(2026,8,13,23,59)),'2026-09-13'));
