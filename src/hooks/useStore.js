import {useState,useEffect,useCallback} from 'react';
import { readStore, saveStore, migrateStore } from '../utils/store';
export { STORAGE_KEY } from '../utils/store';
const empty=migrateStore({tasks:[],details:{},exams:[]});
function read(){try{return {data:readStore(localStorage),error:''};}catch{return {data:empty,error:'無法讀取原有資料，本次編輯尚未成功儲存。原始資料未覆寫；請先保留本次內容，再檢查瀏覽器儲存設定。'};}}
export function useStore() {
  const [initial] = useState(read);
  const [data, setData] = useState(initial.data);
  const [error, setError] = useState(initial.error);
  const retrySave = useCallback(() => {
    // Never save the empty fallback over data that failed to load.
    if (initial.error) return;
    const saved = saveStore(data);
    setError(saved ? '' : '資料尚未成功儲存。目前內容仍保留在此頁，請稍後重試；儲存成功前請勿關閉或重新整理。');
  }, [data, initial.error]);
  useEffect(() => { retrySave(); }, [retrySave]);
  return { data, setData, error, retrySave, canRetrySave: !initial.error };
}
