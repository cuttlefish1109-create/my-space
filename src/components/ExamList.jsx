import {usePlanner} from '../hooks/PlannerContext';
import React from 'react';

import { countdown, daysUntilExam, upcomingExams } from '../utils/exams';
export default function ExamList({ exams, now, upcoming = false, onEdit, onDelete }) {
  const {courses}=usePlanner();
  const list = upcoming ? upcomingExams(exams, now) : [...exams].sort((a, b) => a.examDate.localeCompare(b.examDate));
  return <div className="exam-list">
    {!list.length && <p className="empty">{upcoming ? '目前沒有即將到來的考試。' : '還沒有考試，新增日期後首頁會自動提醒。'}</p>}
    {list.map(exam => {
      const days = daysUntilExam(exam.examDate, now);
      const reminder = days >= 0 && days <= exam.reminderDays;
      const content = <><small>{courses.find(c => c.id === exam.courseId)?.name}</small><strong>{exam.title}</strong>{exam.scope && <p>{exam.scope}</p>}</>;
      return <div key={exam.id} className={`exam-row ${reminder ? 'reminder' : ''} ${days < 0 ? 'past-exam' : ''}`}>
        <span className="countdown">{countdown(days)}</span>
        {upcoming ? <a className="exam-content" href={`#/project/${exam.courseId}`}>{content}</a> : <button className="exam-content" onClick={() => onEdit(exam)}>{content}</button>}
        <time dateTime={exam.examDate}>{exam.examDate}</time>
        {!upcoming && <button className="delete" aria-label={`刪除考試 ${exam.title}`} onClick={() => onDelete(exam.id)}>×</button>}
      </div>;
    })}
  </div>;
}
