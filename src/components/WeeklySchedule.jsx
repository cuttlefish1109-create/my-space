import React, {useState,useEffect} from 'react';
import {usePlanner} from '../hooks/PlannerContext';
import {scheduleDay} from '../utils/clock';
const weekdays = ['MON','TUE','WED','THU','FRI','SAT','SUN'];
const minutes = s => Number(s.split(':')[0])*60+Number(s.split(':')[1]);
export default function WeeklySchedule({now}) {
  const {courses,schedule,onAddCourse,onEditCourse,onDeleteCourse,deletingCourse}=usePlanner();
  const [selectedDay,setDay]=useState('today');
  const [managing,setManaging]=useState(false);
  useEffect(()=>{if(!courses.length)setManaging(false);},[courses.length]);
  const day=scheduleDay(selectedDay,now);
  const days=weekdays.slice(0,schedule.some(s => s.day===0 || s.day===6) ? 7 : 5);
  const firstHour=Math.min(8,...schedule.map(s => Math.floor(minutes(s.start)/60)));
  const lastHour=Math.max(19,...schedule.map(s => Math.ceil(minutes(s.end)/60)));
  const height=(lastHour-firstHour)*52+16;
  return <section id="schedule">
    <div className="section-head schedule-head"><h2>04 / WEEKLY SCHEDULE</h2><div className="schedule-actions"><button onClick={onAddCourse}>＋ ADD COURSE</button>{courses.length>0 && <button aria-expanded={managing} onClick={() => setManaging(!managing)}>{managing ? 'DONE' : 'EDIT / MANAGE'}</button>}</div></div>
    {!schedule.length ? <div className="schedule-empty"><p>No courses yet</p><p className="empty">Add your first course to build your schedule.</p></div> : <>
    <div className="day-tabs"><button onClick={() => setDay('today')} className={selectedDay==='today'?'active':''}>TODAY</button>{days.map((d,i) => <button key={d} className={day===(i+1)%7?'active':''} onClick={() => setDay((i+1)%7)}>{d}</button>)}</div>
    <div className={`timetable ${managing ? 'manage-mode' : ''} ${!days.some((_,i) => (i+1)%7===day)?'no-day':''}`} style={{'--day-count':days.length}}>
      <div className="time-axis"><div className="day-heading">TIME</div>{Array.from({length:lastHour-firstHour+1},(_,i) => <span style={{top:44+i*52}} key={i}>{String(i+firstHour).padStart(2,'0')}:00</span>)}</div>
      {days.map((d,i) => <div key={d} className={`day-column ${day===(i+1)%7?'selected':''}`}><div className={`day-heading ${now.getDay()===(i+1)%7?'is-today':''}`}>{d}</div><div className="day-body" style={{height}}>{schedule.filter(c => c.day===(i+1)%7).map((c,n) => <div className={`course-block color-${courses.findIndex(p => p.id===c.courseId)%4}`} key={`${c.courseId}-${n}`} style={{top:(minutes(c.start)-firstHour*60)*52/60,height:Math.max(26,(minutes(c.end)-minutes(c.start))*52/60)}}><a className="course-content" href={`#/project/${c.courseId}`}><span>{c.start} — {c.end}</span><strong>{courses.find(p => p.id===c.courseId)?.name}</strong>{!managing && <small>查看課程 ↗</small>}</a>{managing && <div className="course-actions"><button disabled={Boolean(deletingCourse)} onClick={() => onEditCourse(courses.find(p => p.id===c.courseId))}>EDIT</button><button disabled={Boolean(deletingCourse)} onClick={() => onDeleteCourse(courses.find(p => p.id===c.courseId))}>DELETE</button></div>}</div>)}</div></div>)}
    </div>
    {!days.some((_,i) => (i+1)%7===day) && <p className="mobile-weekend empty">今天沒有課程。選擇上方星期查看課表。</p>}
    </>}
  </section>;
}
