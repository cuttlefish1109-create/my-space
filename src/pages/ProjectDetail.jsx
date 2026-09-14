import {usePlanner} from '../hooks/PlannerContext';
import React from 'react';
import { categories } from '../data/projects';
import TaskList from '../components/TaskList';
import CourseFiles from '../components/CourseFiles';
import ExamList from '../components/ExamList';
import MeetingTopics from '../components/MeetingTopics';
import { tasksForCourse } from '../utils/tasks';

export default function ProjectDetail({ project, data, now, updateDetail, onAdd, onAddExam, onEditExam, onDeleteExam, ...actions }) {
  const {onEditCourse}=usePlanner();
  const d = data.details[project.id] || {};
  const change = (key, value) => updateDetail(project.id, { ...d, [key]: value });
  return <>
    <a className="back" href="#/">← BACK TO MY SPACE</a>
    <header className="detail-title">
      <span className={`tag ${project.category}`}>{categories[project.category]}</span>
      <h1>{project.name}</h1>
      {project.category === 'school' && <button onClick={() => onEditCourse(project)}>EDIT COURSE</button>}
      {project.category === 'freelance' && <p>GAME ENVIRONMENT DESIGN</p>}
    </header>
    {project.category === 'school' && <>
      <CourseFiles key={project.id} courseId={project.id}/>
      <section><div className="section-head"><h2>EXAMS</h2><button onClick={() => onAddExam(project.id)}>＋ ADD EXAM</button></div>
        <ExamList exams={data.exams.filter(e => e.courseId === project.id)} now={now} onEdit={onEditExam} onDelete={onDeleteExam}/>
      </section>
    </>}
    {project.category === 'freelance' && <section><h2>WORK STAGES</h2><div className="progress-grid">
      {['Concept', 'Modeling', 'Texturing', 'Lighting', 'Final'].map((stage, i) => <label key={stage}><span>0{i + 1} / {stage}</span>
        <select value={d.stages?.[stage] || 'Not Started'} onChange={e => change('stages', { ...d.stages, [stage]: e.target.value })}>
          {['Not Started', 'In Progress', 'Done'].map(v => <option key={v}>{v}</option>)}
        </select></label>)}
    </div></section>}
    {project.category === 'classRep' && <>
      <section className="meeting-date"><label>NEXT MEETING<input type="date" value={(d.meetingDate || '').slice(0, 10)} onChange={e => change('meetingDate', e.target.value)}/></label></section>
      <MeetingTopics value={d.topics} onChange={value => change('topics', value)}/>
    </>}
    <section><div className="section-head"><h2>TO-DO</h2>{project.category !== 'school' && <button className="primary" onClick={() => onAdd(project)}>＋ ADD TASK</button>}</div>
      <TaskList tasks={project.category === 'school' ? tasksForCourse(data.tasks, project.id) : data.tasks.filter(t => t.projectId === project.id && !t.followUp)} {...actions} compact={project.category === 'school'} onEdit={task => actions.onEdit(task, project.category === 'school' ? project : undefined)}/>
      {project.category === 'school' && <button className="text-button" onClick={() => onAdd(project)}>＋ ADD TASK</button>}
    </section>
    <section><h2>{project.category === 'classRep' ? 'MEETING NOTES' : 'NOTES'}</h2>
      <textarea className="notes" aria-label={project.category === 'classRep' ? 'MEETING NOTES' : 'NOTES'} rows={8} placeholder="在這裡記錄進度、想法與備註…" value={d.notes || ''} onChange={e => change('notes', e.target.value)}/>
      <small>編輯內容會自動儲存</small>
    </section>
    {project.category === 'classRep' && <section><div className="section-head"><h2>FOLLOW UP</h2><button onClick={() => onAdd(project, true)}>＋ 新增追蹤事項</button></div>
      <TaskList tasks={data.tasks.filter(t => t.projectId === project.id && t.followUp)} {...actions}/>
    </section>}
  </>;
}


