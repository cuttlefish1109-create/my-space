import React, { useEffect, useRef, useState } from 'react';
import { savePDF, getPDFsByCourse, deletePDF, openPDF } from '../utils/fileStorage';
const sizeLabel = size => size < 1048576 ? `${(size / 1024).toFixed(1)} KB` : `${(size / 1048576).toFixed(1)} MB`;
export default function CourseFiles({ courseId }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const input = useRef();
  useEffect(() => {
    let active = true;
    getPDFsByCourse(courseId).then(result => { if (active) setFiles(result); })
      .catch(() => { if (active) setError('無法讀取 PDF，請確認瀏覽器允許儲存資料後重新整理。'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [courseId]);
  async function upload(event) {
    const file = event.target.files[0];
    if (!file) return;
    setBusy(true); setError('');
    try { const saved = await savePDF(courseId, file); setFiles(current => [saved, ...current]); }
    catch (err) { setError(`未儲存 PDF：${err.message || '請檢查瀏覽器儲存空間。'}`); }
    finally { setBusy(false); if (input.current) input.current.value = ''; }
  }
  async function remove(file) {
    if (!window.confirm(`刪除「${file.fileName}」？`)) return;
    setBusy(true); setError('');
    try { await deletePDF(file.id); setFiles(current => current.filter(f => f.id !== file.id)); }
    catch { setError('PDF 尚未刪除，請再試一次。'); }
    finally { setBusy(false); }
  }
  return <section>
    <div className="section-head"><h2>FILES</h2><button disabled={busy || loading} onClick={() => input.current.click()}>{busy ? '儲存中…' : '＋ ADD PDF'}</button></div>
    <input ref={input} type="file" accept="application/pdf,.pdf" hidden aria-label="選擇 PDF" onChange={upload}/>
    {error && <p role="alert" className="error">{error}</p>}
    {loading ? <p className="empty">讀取 PDF…</p> : !files.length && <p className="empty">還沒有 PDF，加入第一份課程檔案。</p>}
    {files.map(file => <div className="file-row" key={file.id}>
      <button className="file-name" onClick={async () => { setError(''); try { await openPDF(file.id); } catch (err) { setError(err.message); } }}>
        <strong>{file.fileName} <span aria-hidden="true">↗</span></strong>
        <small>{sizeLabel(file.fileSize)} · {new Date(file.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</small>
      </button>
      <button className="delete" disabled={busy} aria-label={`刪除 PDF ${file.fileName}`} onClick={() => remove(file)}>×</button>
    </div>)}
  </section>;
}
