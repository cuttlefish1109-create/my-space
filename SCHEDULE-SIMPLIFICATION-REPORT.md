# 課表簡化完成報告

## 修改檔案
- src/components/WeeklySchedule.jsx：移除 Empty State 的第二個 ADD COURSE、封存清單與 RESTORE；無有效課程時隱藏 EDIT / MANAGE 並退出管理模式。
- src/components/CourseEditor.jsx：新增與編輯統一只顯示 Course Name、Day、Start Time、End Time，以及 SAVE / CANCEL；刪除仍由 Weekly Schedule 管理模式執行。
- src/data/courses.js：saveCourse 僅接受一個 session；增加 activeCourseData 唯讀畫面投影，保留底層資料。
- src/App.jsx：畫面與 Context 僅使用 active 課程及可顯示資料；刪除／不存在課程網址返回首頁；移除恢復操作及過時的確認提示。
- src/pages/ProjectDetail.jsx：移除封存說明與恢復按鈕，維持有效課程的簡潔 Detail。
- src/styles.css：移除已不用的封存清單／多時段樣式，調整表單按鈕留白。
- dist/：正式版重新建置。

## 新增檔案
- src/utils/activeCourses.test.js
- .qa/simple-courses-check.mjs
- .qa/simple-manage-mobile.png
- .qa/simple-empty-mobile.png
- SCHEDULE-SIMPLIFICATION-REPORT.md

## ADD COURSE 與 Empty State
WeeklySchedule.jsx 中移除 schedule-empty 內的按鈕，只保留 section-head 右上角 ADD COURSE。無有效課程時僅顯示 No courses yet / Add your first course to build your schedule.，不 render MANAGE、EDIT、DELETE、封存清單或 RESTORE。

## UI 與資料安全
App 使用 activeCourseData(data) 建立唯讀顯示資料：courses 排除 archived；school Tasks 排除指向 archived course 的項目；Exams 僅顯示 active course 的項目。TODAY、MY TASKS、UPCOMING EXAMS、課表與課程路由共用此資料來源。原始 useStore data 完整保留；setData 仍只修改原始 store。

DELETE 繼續重用既有關聯檢查、PDF 數量讀取、安全確認與 archiveCourse。沒有永久刪除 Tasks、Exams、Notes、details 或 IndexedDB PDF。確認後 archived:true 留在 my-space.v1，但一般 UI 不顯示。舊課程網址返回首頁，不留下空白頁。這版沒有 UI 恢復入口。

## 單一時段及舊資料
保留既有 sessions 儲存結構以相容舊資料，新建／儲存一律只有一筆 session。CourseEditor 不再 render 時段清單、ADD TIME、移除時段或第二組時間。更新仍使用原 id，saveCourse 不以課名作關聯 key。

舊多時段課程在載入時保持原資料；第一次編輯時表單顯示原第一個時段。按 SAVE 才改為表單中的單一時段，原始多時段複製至該課程的 legacySessions 留存；CANCEL 不變更資料。此為唯一會影響舊課表時段的行為。Tasks、Exams、Notes、PDF 關聯不變。

## 管理模式及保留功能
有效課程仍可 EDIT / MANAGE → EDIT / DELETE → DONE。空課表不顯示無用途管理按鈕。手機保留 day tabs，管理按鈕不重疊。Space Name、Navigation、Quick Task、真實日期／午夜更新、Exam reminder window、其他分類與 courses=[] 初始化保持原有邏輯。

## 驗證
npm test：21/21 通過。
npm run build：成功。
.qa/simple-courses-check.mjs：A–Z 瀏覽器測試通過，涵蓋空課表單一 ADD、四欄位表單、CANCEL、新增／reload、單時段改名移動與固定 ID、管理模式、直接刪除取消／確認、封存畫面隱藏、已刪除課程網址、TODAY／Exams 隱藏、Space Name、Quick Task、Navigation、午夜切換及手機。

測試直接比較刪除前後的 Tasks／Exams／details／spaceName，並從 IndexedDB 讀回 PDF Blob 內容與 courseId，確認底層資料仍完整。另有單元測試驗證 legacy 多時段備份與唯讀畫面投影。所有瀏覽器測試使用獨立 context，未清空或改動使用者實際瀏覽器資料。

過往報告及 .qa 腳本中的 RESTORE / multiple time slots 描述屬歷史版本；本次目前行為以此報告及 simple-courses-check.mjs 為準。
