import React, { useState } from 'react';
export default function MeetingTopics({ value, onChange }) {
  const [draft, setDraft] = useState('');
  // Legacy text remains intact as editable lines; migrate only when edited.
  const topics = Array.isArray(value) ? value : typeof value === 'string' ? value.split('\n') : [];
  return <section><h2>MEETING TOPICS</h2>
    {topics.map((topic, index) => <div className="topic-row" key={index}>
      <input aria-label={`議題 ${index + 1}`} value={topic} onChange={e => onChange(topics.map((t, i) => i === index ? e.target.value : t))}/>
      <button className="delete" aria-label={`刪除議題 ${index + 1}`} onClick={() => onChange(topics.filter((_, i) => i !== index))}>×</button>
    </div>)}
    <form className="topic-row" onSubmit={e => { e.preventDefault(); if (draft.trim()) { onChange([...topics, draft.trim()]); setDraft(''); } }}>
      <input aria-label="新增議題" placeholder="新增會議議題…" value={draft} onChange={e => setDraft(e.target.value)}/>
      <button type="submit" disabled={!draft.trim()}>＋ 新增</button>
    </form>
  </section>;
}
