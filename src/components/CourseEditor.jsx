import React, {useEffect,useRef,useState} from 'react';
import {courseError} from '../data/courses';
const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
export default function CourseEditor({course,onSave,onClose}) {
  const [form,setForm] = useState({name:course?.name || '',sessions:[{...(course?.sessions[0] || {day:1,start:'09:10',end:'12:00'})}]});
  const [error,setError] = useState('');
  const dialog = useRef();
  useEffect(() => {dialog.current.showModal();},[]);
  const session=form.sessions[0];
  const changeSession=(key,value)=>setForm(f=>({...f,sessions:[{...f.sessions[0],[key]:value}]}));
  return <dialog ref={dialog} onCancel={onClose} onClick={e=>{if(e.target===dialog.current)onClose();}}>
    <form onSubmit={e=>{e.preventDefault();const message=courseError(form);setError(message);if(!message)onSave(form,course?.id);}}>
      <div className="section-head"><h2>{course?'EDIT COURSE':'ADD COURSE'}</h2><button type="button" aria-label="關閉" onClick={onClose}>×</button></div>
      <label>Course Name<input required autoFocus maxLength={200} value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label>
      <label>Day<select value={session.day} onChange={e=>changeSession('day',Number(e.target.value))}>{days.map((d,n)=><option key={d} value={n}>{d}</option>)}</select></label>
      <div className="form-grid"><label>Start Time<input required type="time" value={session.start} onChange={e=>changeSession('start',e.target.value)}/></label><label>End Time<input required type="time" value={session.end} onChange={e=>changeSession('end',e.target.value)}/></label></div>
      {error && <p role="alert" className="error">{error}</p>}
      <div className="form-actions course-form-actions"><button type="button" onClick={onClose}>CANCEL</button><button className="primary" type="submit">SAVE</button></div>
    </form>
  </dialog>;
}
