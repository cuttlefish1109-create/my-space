const DATABASE = 'my-space-files';
const STORE = 'pdfs';
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE, 1);
    request.onupgradeneeded = () => {
      const store = request.result.createObjectStore(STORE, { keyPath: 'id' });
      store.createIndex('courseId', 'courseId', { unique: false });
    };
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('請關閉其他 MY SPACE 分頁後再試。'));
    request.onsuccess = () => {
      const db = request.result;
      db.onversionchange = () => db.close();
      resolve(db);
    };
  });
}
async function transact(mode, operation) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE, mode);
    let request;
    try { request = operation(transaction.objectStore(STORE)); }
    catch (error) { db.close(); reject(error); return; }
    transaction.oncomplete = () => { db.close(); resolve(request.result); };
    transaction.onabort = () => { db.close(); reject(transaction.error || request.error || new Error('PDF 儲存失敗')); };
  });
}
export async function savePDF(courseId, file) {
  if (!courseId) throw new Error('請先選擇課程。');
  const header = new TextDecoder().decode(await file.slice(0, 5).arrayBuffer());
  if (header !== '%PDF-') throw new Error('請選擇有效的 PDF 檔案。');
  const record = {
    id: crypto.randomUUID(), courseId, fileName: file.name,
    fileType: 'application/pdf', fileSize: file.size, uploadedAt: new Date().toISOString(),
    blob: new Blob([file], { type: 'application/pdf' }),
  };
  await transact('readwrite', store => store.add(record));
  const { blob, ...metadata } = record;
  return metadata;
}
export async function getPDFsByCourse(courseId) {
  // Keep PDF Blobs out of React state when listing metadata.
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE, 'readonly');
    const request = transaction.objectStore(STORE).index('courseId').openCursor(IDBKeyRange.only(courseId));
    const records = [];
    request.onsuccess = () => {
      const cursor = request.result;
      if (!cursor) return;
      const { blob, ...metadata } = cursor.value;
      records.push(metadata);
      cursor.continue();
    };
    transaction.oncomplete = () => { db.close(); resolve(records.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt))); };
    transaction.onabort = () => { db.close(); reject(transaction.error || request.error); };
  });
}
export const getPDF = id => transact('readonly', store => store.get(id));
export const deletePDF = id => transact('readwrite', store => store.delete(id));
const openURLs = new Map();
export function releasePDFURLs() {
  for (const [url, timer] of openURLs) { clearInterval(timer); URL.revokeObjectURL(url); }
  openURLs.clear();
}
if (typeof window !== 'undefined') window.addEventListener('pagehide', releasePDFURLs);
if (import.meta.hot) import.meta.hot.dispose(releasePDFURLs);
export async function openPDF(id) {
  // Reserve a tab synchronously to avoid popup blocking after the async read.
  const preview = window.open('about:blank', '_blank');
  if (!preview) throw new Error('請允許此網站開啟新分頁，再點一次 PDF。');
  preview.opener = null;
  try {
    const record = await getPDF(id);
    if (!record) throw new Error('找不到這份 PDF，請重新整理清單。');
    if (preview.closed) return;
    const url = URL.createObjectURL(record.blob);
    preview.location.href = url;
    // Retain while the PDF reader is open; revoke after tab close or page exit.
    const timer = setInterval(() => {
      if (preview.closed) { clearInterval(timer); URL.revokeObjectURL(url); openURLs.delete(url); }
    }, 1500);
    openURLs.set(url, timer);
  } catch (error) { preview.close(); throw error; }
}
