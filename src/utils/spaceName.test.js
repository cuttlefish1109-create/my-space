import {test} from 'node:test';
import assert from 'node:assert/strict';
import {displaySpaceName,migrateStore,saveStore,readStore} from './store.js';
test('space name fallback handles invalid values without replacing saved data',()=>{
 for(const value of [undefined,null,'','   ',42,{},[]])assert.equal(displaySpaceName(value),'MY SPACE');
 for(const value of ["MING'S SPACE",'我的空間','2026 FALL','A'.repeat(500)])assert.equal(displaySpaceName(value),value);
 const original={tasks:[{id:'t'}],details:{notes:'keep'},exams:[],courses:[],spaceName:42,extra:true};
 assert.deepEqual(migrateStore(original),original);
 let raw;const renamed={...original,spaceName:'我的空間'};saveStore(renamed,()=>({setItem:(key,value)=>raw=value}));assert.deepEqual(readStore({getItem:()=>raw}),renamed);
});
