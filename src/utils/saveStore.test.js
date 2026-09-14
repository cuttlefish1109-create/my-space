import { test } from 'node:test';
import assert from 'node:assert/strict';
import { saveStore, STORAGE_KEY } from './store.js';

test('failed save retains saved data and current edits; retry saves the edits', () => {
  const original = '{"tasks":[],"details":{},"exams":[]}';
  let stored = original;
  let blocked = true;
  const edits = { tasks: [{ id: 'task', title: '保留本次修改' }], details: {}, exams: [] };
  const copy = structuredClone(edits);
  const storage = { setItem(key, value) {
    assert.equal(key, STORAGE_KEY);
    if (blocked) throw new DOMException('Full', 'QuotaExceededError');
    stored = value;
  }};
  assert.equal(saveStore(edits, () => storage), false);
  assert.equal(stored, original);
  assert.deepEqual(edits, copy);
  blocked = false;
  assert.equal(saveStore(edits, () => storage), true);
  assert.deepEqual(JSON.parse(stored), edits);
});
test('storage access denied and serialization errors are caught', () => {
  assert.equal(saveStore({}, () => { throw new DOMException('Denied', 'SecurityError'); }), false);
  const circular = {}; circular.self = circular;
  let wrote = false;
  assert.equal(saveStore(circular, () => ({ setItem() { wrote = true; } })), false);
  assert.equal(wrote, false);
});
