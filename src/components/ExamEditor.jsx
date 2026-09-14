import React, { useEffect, useRef, useState } from 'react';
export default function ExamEditor({ exam, courseId, onSave, onClose }) {
  const [form, setForm] = useState(exam || { courseId, title: '', examDate: '', scope: '', reminderDays: 14 });
  const dialog = useRef();
  useEffect(() => { dialog.current.showModal(); }, []);
  const field = key => ({ value: form[key], onChange: e => setForm({ ...form, [key]: e.target.value }) });
  return <dialog ref={dialog} onCancel={onClose} onClick={e => { if (e.target === dialog.current) onClose(); }}>
    <form onSubmit={e => { e.preventDefault(); if (form.title.trim()) onSave({ ...form, title: form.title.trim(), reminderDays: Number(form.reminderDays) }); }}>
      <div className="section-head"><h2>{exam ? 'EDIT EXAM' : 'ADD EXAM'}</h2><button type="button" onClick={onClose} aria-label="關閉">×</button></div>
      <label>Exam Name<input autoFocus required maxLength={200} {...field('title')} placeholder="MIDTERM"/></label>
      <div className="form-grid"><label>Date<input type="date" required {...field('examDate')}/></label>
        <label>Reminder<select {...field('reminderDays')}>{[3, 7, 14, 30].map(days => <option value={days} key={days}>{days} DAYS BEFORE</option>)}</select></label></div>
      <label>Scope（選填）<textarea rows={3} {...field('scope')} placeholder="Chapter 1–5"/></label>
      <div className="form-actions"><button type="button" onClick={onClose}>取消</button><button className="primary" type="submit">儲存考試</button></div>
    </form>
  </dialog>;
}
