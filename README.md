# MY SPACE

React + Vite + JavaScript 的本機個人工作、課程與生活管理工具。沿用既有專案，無登入、後端或雲端儲存。

## 啟動與檢查

已安裝套件時直接執行：

```sh
npm run dev
```

開啟終端機顯示的網址（通常為 http://127.0.0.1:5173/）。首次安裝才需要 `npm install`。

```sh
npm test
npm run build
npm run preview
```

`npm test` 使用 Node 內建測試，檢查待辦排序、資料相容性、儲存失敗與重試、考試倒數、跨日切換。正式建置輸出至 dist。

## 已完成的功能

### 首頁

依序為 TODAY、MY TASKS、UPCOMING EXAMS、WEEKLY SCHEDULE。

- TODAY：從課表及統一 Tasks 取得當天課程與今天到期的未完成待辦。
- MY TASKS：ALL / SCHOOL / FREELANCE / CLASS REP / PERSONAL 篩選；未完成依期限排序，逾期、今天、未來、無期限依序顯示。可切換顯示已完成，已完成放最後。
- QUICK TASK：Title、Deadline、Category，以及選填 Project / Course 和 Notes。預設 PERSONAL，projectId 為 null。
- WEEKLY SCHEDULE：桌面顯示週一至週五，連續課程為完整區塊。同課程跨日使用同一 courseId、進入同一課程頁。手機切換單日。
- TODAY 模式跨午夜自動更新，不必重新整理。手動選擇 MON–FRI 時維持該星期；點 TODAY 恢復跟隨今天。
- 日期在午夜更新，另每 30 秒校正；切回分頁或視窗時也更新。電腦休眠或瀏覽器暫停背景執行時，會在恢復執行後更新。

### Course Files / PDF

課程頁依序只顯示 FILES、EXAMS、TO-DO、NOTES。老師、教室、Week、Current Topic 等舊欄位已隱藏，既有儲存內容不會因此刪除。

- ADD PDF 選擇檔案後自動保存；列表顯示檔名、大小與上傳日期。
- PDF Blob 使用 IndexedDB，資料庫 `my-space-files`、object store `pdfs`，依 courseId 分開。
- 檔案欄位：id、courseId、fileName、fileType、fileSize、uploadedAt、blob。
- `src/utils/fileStorage.js` 提供 savePDF、getPDFsByCourse、getPDF、deletePDF。
- 點檔名建立 Blob URL，以新分頁使用瀏覽器內建 PDF Reader。閱讀分頁關閉或來源頁面離開時會釋放 Blob URL；PDF 原始 Blob 仍保留在 IndexedDB。
- 沒有使用 PDF.js，也沒有將 PDF 存入 localStorage。

### Exams / Exam Reminder / Upcoming Exams

- 課程內新增、編輯與刪除 Exam：Exam Name、Date、Reminder，Scope 選填。
- 提醒選項：提前 3 / 7 / 14 / 30 天，預設 14 天。
- Exam 與 Task 分開，考試不會自動建立待辦。
- 依本機日曆日期計算 daysUntilExam，處理跨月、跨年；不以當下距離考試的剩餘小時取整。
- `0 <= daysUntilExam <= reminderDays` 時進入提醒狀態，顯示 DAYS LEFT、TOMORROW 或 TODAY。
- 首頁 Upcoming Exams 依日期排列未來與當天的考試，提醒期間使用較醒目的文字與細線。過去考試保留在課程頁。
- 提醒是網站內顯示，不是背景通知或推播。

### Freelance

遊戲場景設計提供 Concept、Modeling、Texturing、Lighting、Final 工作階段，每階段可設 Not Started / In Progress / Done，另有共用 TO-DO 與 NOTES。

### Class Rep

班代開會提供 Next Meeting 日期、可新增／編輯／刪除的 Meeting Topics、共用 TO-DO、Meeting Notes、Follow Up。舊的多行議題文字可繼續使用，修改時才轉成議題列表。

### Personal Tasks

生活待辦使用 PERSONAL，不需 Project。首頁 QUICK TASK 可直接建立。所有分類及各 Detail Page 共用同一份 Tasks，新增、修改、完成及刪除會同步反映在首頁。

## 資料保存與失敗處理

- 文字資料由 `src/hooks/useStore.js` 集中管理，localStorage key 保持 `my-space.v1`。
- 既有結構為 tasks、details、exams。details 保存課程筆記、Freelance 與 Class Rep 資料。Task 欄位維持 id、title、category、projectId、deadline、completed、createdAt、notes；追蹤事項使用既有 followUp 欄位。
- `src/utils/store.js` 保留既有資料與未知欄位；旧資料缺少 exams 時只補上空陣列，不清除 Tasks 或 Notes。
- 編輯後自動保存。寫入失敗時，不重設目前記憶體資料、不刪除原有儲存內容，顯示「資料尚未成功儲存」與重試按鈕。下次編輯或按重試會再次保存最新內容；成功後提示消失。
- 尚未儲存的編輯只留在目前頁面。看到提示時請先不要關閉或重新整理，待儲存成功後再離開。
- 若初次讀取失敗，會阻止後續寫入，避免空白預設值覆蓋原有資料；提示使用者保留本次內容並檢查瀏覽器設定。
- 本機資料屬於同一瀏覽器與同一來源（協定、主機、連接埠）。localhost 和 127.0.0.1、不同連接埠不共用。清除網站資料會移除保存內容。

## 主要檔案

- `src/data/schedule.js`：真實課表、星期、時間、courseId。
- `src/data/projects.js`：課程及 Project 清單；新增課程時使用唯一 id。
- `src/pages/Home.jsx`：首頁四個主要區域。
- `src/pages/ProjectDetail.jsx`：課程、接案與班代頁。
- `src/components/TaskEditor.jsx`、`TaskList.jsx`：共用 Task UI。
- `src/components/CourseFiles.jsx`：課程 PDF 列表與操作。
- `src/components/ExamEditor.jsx`、`ExamList.jsx`：考試表單、清單及提醒。
- `src/components/WeeklySchedule.jsx`、`src/utils/clock.js`：課表日期選擇與午夜計時。
- `src/hooks/useStore.js`、`src/utils/store.js`：文字儲存與保留資料的合併邏輯。
- `src/utils/fileStorage.js`：IndexedDB 與 PDF Blob URL。
- `src/utils/exams.js`：考試倒數。
- `src/styles.css`：版面與樣式；套用 Figma 時主要修改此檔與 pages / components。

## 瀏覽器實測

1. 新增 PERSONAL 待辦並設定今天期限；確認 TODAY 與 MY TASKS 同時出現，刷新後仍在。
2. 從課程新增待辦，再到首頁勾完成，回課程確認同步。
3. 課程上傳 PDF，刷新、開新分頁閱讀，再切其他課程確認不混檔。
4. 新增一個 14 天後的考試，設定 14 天提醒；首頁應顯示 14 DAYS LEFT。改為明天／今天，應顯示 TOMORROW／TODAY。
5. 手機版選 TODAY 並讓頁面跨午夜，日期與當日課程自動更新。手選某個星期則保留選擇。
6. 儲存失敗可在不含真實資料的測試瀏覽器中，以 DevTools 暫時模擬 localStorage.setItem 拋出錯誤，再修改測試待辦。確認提示出現、編輯仍在；恢復寫入後按「重試儲存」，提示消失、刷新後資料保留。不要用清除網站資料或填滿真實儲存空間來測試。
