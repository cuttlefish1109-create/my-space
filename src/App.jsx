import {getPDFsByCourse} from './utils/fileStorage';
import React, { useState, useEffect } from 'react';
import { useStore } from './hooks/useStore';
import { otherProjects } from './data/projects';
import { makeTask, bindCourseTask } from './utils/tasks';
import { millisecondsUntilMidnight } from './utils/clock';
import {PlannerContext} from './hooks/PlannerContext';
import {saveCourse,archiveCourse,courseSchedule,activeCourseData} from './data/courses';
import SpaceHeader from './components/SpaceHeader';
import CourseEditor from './components/CourseEditor';
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import TaskEditor from './components/TaskEditor';
import ExamEditor from './components/ExamEditor';

export default function App() {
  const { data, setData, error, retrySave, canRetrySave } = useStore();
  const visibleData = activeCourseData(data);
  const projects = [...visibleData.courses, ...otherProjects];
  const [courseEditor, setCourseEditor] = useState(null);
  const [deletingCourse,setDeletingCourse] = useState(null);
  const [route, setRoute] = useState(location.hash);
  const [editor, setEditor] = useState(null);
  const [examEditor, setExamEditor] = useState(null);
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const navigate = () => { setRoute(location.hash); if (location.hash.startsWith('#/')) window.scrollTo(0, 0); };
    const refreshDate = () => setNow(new Date());
    window.addEventListener('hashchange', navigate);
    window.addEventListener('focus', refreshDate);
    document.addEventListener('visibilitychange', refreshDate);
    
    let midnightTimer;
    const scheduleMidnight = () => {
      midnightTimer = setTimeout(() => {
        refreshDate();
        scheduleMidnight();
      }, millisecondsUntilMidnight(new Date()));
    };
    scheduleMidnight();
    return () => {
      window.removeEventListener('hashchange', navigate);
      window.removeEventListener('focus', refreshDate);
      document.removeEventListener('visibilitychange', refreshDate);
      
      clearTimeout(midnightTimer);
    };
  }, []);
  const project = projects.find(p => route === `#/project/${p.id}`);
  useEffect(() => {
    if (route.startsWith('#/project/') && !project) location.replace('#/');
  }, [route, project]);
  useEffect(() => {
    if (route === '#tasks' || route === '#schedule') {
      document.getElementById(route.slice(1))?.scrollIntoView();
    }
  }, [route]);
  const actions = {
    onAdd: (project, followUp = false) => setEditor({ project, followUp }),
    onEdit: (task, project) => setEditor({ task, project }),
    onToggle: id => setData(d => ({ ...d, tasks: d.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t) })),
    onDelete: id => { if (window.confirm('刪除這個待辦？')) setData(d => ({ ...d, tasks: d.tasks.filter(t => t.id !== id) })); },
  };
  const deleteCourse = async course => {
    if (deletingCourse) return;
    setDeletingCourse(course.id);
    try {
    let files, fileCount;
    try { fileCount = (await getPDFsByCourse(course.id)).length; files = `${fileCount} Files`; } catch { files = 'Files 無法讀取，仍會完整保留'; }
    const related = `${data.tasks.filter(t => t.projectId === course.id).length} Tasks、${data.exams.filter(e => e.courseId === course.id).length} Exams、${data.details[course.id]?.notes ? '有 Notes' : '無 Notes'}、${files}`;
    const hasRelated = fileCount !== 0 || data.tasks.some(t => t.projectId === course.id) || data.exams.some(e => e.courseId === course.id) || Boolean(data.details[course.id]?.notes);
    if (!window.confirm(`${hasRelated ? (fileCount === undefined ? 'Related files could not be checked.\nAre you sure you want to delete this course?' : 'This course still has related data.\nAre you sure you want to delete this course?') : 'Delete this course?'}\n「${course.name}」目前關聯資料：${related}。\n刪除將封存課程並從課表移除；所有關聯資料與 PDF 都會保留，但不再顯示於一般畫面。`)) return;
    setData(d => archiveCourse(d,course.id));
    setCourseEditor(null);
    } finally { setDeletingCourse(null); }
  };
  return <PlannerContext.Provider value={{courses:visibleData.courses,projects,schedule:courseSchedule(visibleData.courses),now,onDeleteCourse:deleteCourse,deletingCourse,onAddCourse:() => setCourseEditor({}),onEditCourse:course => setCourseEditor({course})}}><>
    <nav>
      <div><a href="#/">OVERVIEW</a><a href="#tasks">MY TASKS</a><a href="#schedule">SCHEDULE</a></div>
      
    </nav>
    <main>
      {error && <div className="save-status"><p role="status" aria-live="polite">{error}</p>{canRetrySave && <button onClick={retrySave}>重試儲存</button>}</div>}
      {project ? <ProjectDetail key={project.id} project={project} data={visibleData} now={now} {...actions}
        updateDetail={(id, detail) => setData(d => ({ ...d, details: { ...d.details, [id]: detail } }))}
        onAddExam={courseId => setExamEditor({ courseId })}
        onEditExam={exam => setExamEditor({ exam })}
        onDeleteExam={id => { if (window.confirm('刪除這個考試？')) setData(d => ({ ...d, exams: d.exams.filter(e => e.id !== id) })); }}
      /> : <>
        <SpaceHeader spaceName={data.spaceName} onSave={spaceName => setData(d => ({...d,spaceName}))}/>
        <Home data={visibleData} now={now} {...actions}/>
      </>}
      <footer><strong>MY SPACE</strong><span>ONE DAY AT A TIME.</span><span>個人的日常，慢慢完成。</span></footer>
    </main>
    {editor && <TaskEditor {...editor} onClose={() => setEditor(null)} onSave={form => {
      const course = editor.project?.category === 'school' ? editor.project : projects.find(p => p.category === 'school' && editor.task?.category === 'school' && p.id === editor.task.projectId);
      form = bindCourseTask(form, course);
      setData(d => ({ ...d, tasks: editor.task ? d.tasks.map(t => t.id === form.id ? form : t) : [...d.tasks, makeTask({ ...form, followUp: Boolean(editor.followUp && form.projectId === editor.project?.id) })] }));
      setEditor(null);
    }}/>}
    {examEditor && <ExamEditor {...examEditor} onClose={() => setExamEditor(null)} onSave={form => {
      setData(d => ({ ...d, exams: examEditor.exam ? d.exams.map(e => e.id === form.id ? form : e) : [...d.exams, { ...form, id: crypto.randomUUID() }] }));
      setExamEditor(null);
    }}/>}
    {courseEditor && <CourseEditor {...courseEditor} onClose={() => setCourseEditor(null)} onSave={(form,id) => {setData(d => saveCourse(d,form,id)); setCourseEditor(null);}}/>}
  </></PlannerContext.Provider>;
}


