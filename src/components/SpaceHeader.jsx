import React, {useEffect,useRef,useState} from 'react';
import {displaySpaceName} from '../utils/store';
export default function SpaceHeader({spaceName,onSave}) {
  const [editing,setEditing]=useState(false);
  return <header className="home-title"><div className="space-heading"><h1>{displaySpaceName(spaceName)}</h1><button className="text-button edit-name" onClick={()=>setEditing(true)}>EDIT NAME</button></div><small className="space-tagline">WORK / STUDY / LIFE</small>
    {editing && <NameEditor name={displaySpaceName(spaceName)} onClose={()=>setEditing(false)} onSave={name=>{onSave(name);setEditing(false);}}/>}
  </header>;
}
function NameEditor({name,onSave,onClose}) {
  const [value,setValue]=useState(name);
  const [error,setError]=useState('');
  const dialog=useRef();
  useEffect(()=>{dialog.current.showModal();},[]);
  return <dialog ref={dialog} aria-label="Edit Space Name" onCancel={onClose} onClick={e=>{if(e.target===dialog.current)onClose();}}><form onSubmit={e=>{e.preventDefault();if(!value.trim()){setError('請輸入名稱，不能只有空白。');return;}onSave(value.trim());}}>
    <div className="section-head"><h2>EDIT NAME</h2><button type="button" aria-label="關閉" onClick={onClose}>×</button></div>
    <label>Space Name<input autoFocus required value={value} onChange={e=>{setValue(e.target.value);setError('');}}/></label>
    {error && <p className="error" role="alert">{error}</p>}
    <div className="form-actions"><button type="button" onClick={onClose}>CANCEL</button><button className="primary" type="submit">SAVE</button></div>
  </form></dialog>;
}
