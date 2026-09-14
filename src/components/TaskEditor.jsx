import {usePlanner} from '../hooks/PlannerContext';
import React, { useState, useRef, useEffect } from 'react';
import { categories } from '../data/projects';
export default function TaskEditor({ task, project, onSave, onClose }) {
  const {projects}=usePlanner();
  const course = project?.category === 'school' ? project : projects.find(p => p.category === 'school' && task?.category === 'school' && p.id === task.projectId);
  const [form, setForm] = useState(task || { title: '', category: project?.category || 'personal', projectId: project?.id ?? null, deadline: '', notes: '' });
  const ref = useRef();
  useEffect(() => { ref.current.showModal(); }, []);
  const field = key => ({ value: form[key] || '', onChange: e => setForm({ ...form, [key]: e.target.value }) });
  return <dialog ref={ref} onCancel={onClose} onClick={e => { if (e.target === ref.current) onClose(); }}>
    <form onSubmit={e => {
      e.preventDefault();
      if (form.title.trim()) onSave({ ...form, title: form.title.trim(), projectId: form.category === 'personal' ? null : form.projectId || null });
    }}>
      <div className="section-head"><h2>{task ? 'EDIT TASK' : project ? 'ADD TASK' : 'QUICK TASK'}</h2><button type="button" onClick={onClose} aria-label="關閉">×</button></div>
      <label>Title<input autoFocus required maxLength={200} placeholder="接下來想完成什麼？" {...field('title')}/></label>
      <div className="form-grid">
        <label>Deadline<input type="date" {...field('deadline')}/></label>
        {!course && <label>Category<select value={form.category} onChange={e => setForm({ ...form, category: e.target.value, projectId: null, followUp: false })}>
          {Object.entries(categories).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select></label>}
      </div>
      
      <label>Notes（選填）<textarea rows={3} placeholder="補充細節、備註…" {...field('notes')}/></label>
      <div className="form-actions"><button type="button" onClick={onClose}>取消</button><button className="primary" type="submit">儲存待辦 ↗</button></div>
    </form>
  </dialog>;
}

