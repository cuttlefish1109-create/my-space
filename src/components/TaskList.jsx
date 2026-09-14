import {usePlanner} from '../hooks/PlannerContext';
import React from 'react';
import { categories } from '../data/projects';
import { sortTasks, localDate } from '../utils/tasks';

export default function TaskList({ tasks, onEdit, onToggle, onDelete, compact = false }) {
  const {projects,now}=usePlanner();
  return <div className={`task-list ${compact ? 'course-task-list' : ''}`}>
    {sortTasks(tasks).map(task => <div className={`task-row ${task.completed ? 'completed' : ''}`} key={task.id}>
      <input aria-label={`完成 ${task.title}`} type="checkbox" checked={task.completed} onChange={() => onToggle(task.id)}/>
      <button className="task-title" onClick={() => onEdit(task)}>
        <strong>{task.title}</strong>
        {!compact && <span>{projects.find(p => p.id === task.projectId)?.name || '一般待辦'}{task.notes && ` · ${task.notes}`}</span>}
      </button>
      {!compact && <span className={`tag ${task.category}`}>{categories[task.category]}</span>}
      <time className={task.deadline && task.deadline < localDate(now) && !task.completed ? 'overdue' : ''}>{task.deadline || '無期限'}</time>
      <button className="delete" aria-label={`刪除 ${task.title}`} onClick={() => onDelete(task.id)}>×</button>
    </div>)}
    {!tasks.length && <p className="empty">{compact ? 'No tasks yet.' : '目前沒有待辦，留一點空間給自己。'}</p>}
  </div>;
}
