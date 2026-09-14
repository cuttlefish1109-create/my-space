# 可編輯課程完成紀錄

直接修改本專案，未建立、複製或移動專案。

## 修改檔案
- src/App.jsx：共用課程 Context、課程編輯操作、安全封存確認、共用日期。
- src/components/WeeklySchedule.jsx：新增／管理入口、動態課表、封存清單與恢復、手機 day tabs。
- src/components/TaskList.jsx：從共同課程資料取得名稱與共同日期。
- src/components/TaskEditor.jsx：從共同課程資料解析固定 course ID，Quick Task 不加入選課欄位。
- src/components/ExamList.jsx：動態課程名稱。
- src/pages/Home.jsx：TODAY 使用動態課表。
- src/pages/ProjectDetail.jsx：課程編輯與恢復入口，原有資源和統一 TO-DO 保留。
- src/data/projects.js、src/data/schedule.js：預設課程改由 courses.js 衍生；非學校專案獨立保留。
- src/hooks/useStore.js、src/utils/store.js：整合 courses 與安全 migration。
- src/utils/exams.js：首頁只顯示 reminder window 內考試。
- src/utils/store.test.js：更新 migration 預期。
- src/styles.css：沿用細線、低飽和樣式與手機表單布局。
- dist/：npm run build 重新產生正式版資源。

## 新增檔案
- src/data/courses.js
- src/hooks/PlannerContext.js
- src/components/CourseEditor.jsx
- src/utils/courses.test.js
- .qa/editable-courses-check.mjs
- .qa/course-mobile.png、.qa/course-desktop.png：獨立測試瀏覽器中的畫面。
- COURSE-EDITING-REPORT.md：本紀錄。

## 資料架構
Single Source of Truth 是 useStore 的 data.courses，由 PlannerContext 提供給各畫面。src/data/courses.js 保留 legacy/example 課表及純資料操作函式，個人課表不會自動初始化到使用者資料。schedule 是 courses.sessions 的衍生資料，不獨立保存名稱或時段。每堂課可有多個 sessions，以保留 course-4 的週二與週五時段。

既有 course-1～course-9 完全保留。新課程只在建立時使用 crypto.randomUUID()；更新只修改 name、sessions，忽略表單中的 id，因此改名、星期或時間不會更換 ID。

my-space.v1 的原物件增加 courses: [{id,name,category:'school',sessions:[{day,start,end}],archived?}]。每次 state 更新沿用既有儲存流程。當 courses 缺少時初始化為 []；已存在的 courses、空陣列與封存狀態均保留，不填入舊課表。Tasks、Exams、details、未知欄位保留。無法解析或無效儲存資料時仍沿用既有錯誤保護，不覆寫原始值。

PDF 仍存放在 my-space-files / pdfs 的 IndexedDB Blob，查詢仍使用固定 courseId。沒有修改 fileStorage.js 或 CourseFiles.jsx，也没有搬移 PDF。刪除課程只設定 archived:true，確認訊息列出 Tasks、Exams、Notes、Files；讀不到 Files 時也明示保留。管理清單可以進入封存課程或恢復。沒有永久刪除任何關聯資料。

## 日期與提醒
App 持有唯一 now，午夜使用 millisecondsUntilMidnight 排定下一次更新，並在 focus、visibilitychange 時重新讀取裝置日期。已移除原本每 30 秒的輪詢。TODAY、首頁日期、課表 today、Task overdue 與 Exam countdown 使用共同日期。手動選擇星期保持選擇；TODAY 模式跨午夜跟隨新日期。

考試 reminderDays 保留 3、7、14、30，預設 14；首頁只顯示非過期且進入提醒天數的考試。封存課程的考試仍可提醒並連到保留的課程資料。

## 驗證與資料影響
npm test：18/18 通過。
npm run build：成功。

獨立無痕瀏覽器測試通過：新增課程立即出現、課名／星期／時間更新、既有 ID 保持、Task 名稱同步、Notes／Exam 保留、PDF 真正寫入 IndexedDB 並於改名與 reload 後可列出、delete 取消及確認、封存後 reload 與恢復、Quick Task 與 Navigation 不含選課下拉、週一跨午夜到週二的首頁日期／TODAY／考試倒數、手機新增／編輯／刪除課程、Course TO-DO 新增／完成／編輯／刪除與首頁同步、Freelance／Class Rep／Personal Tasks。桌面與手機畫面已檢視。

沒有清空使用者 localStorage，也沒有對使用者真實瀏覽器資料執行測試；测试使用獨立 context。課程封存是有意改變：從課表移除，資料仍保留且可恢復。瀏覽器儲存失敗時仍會顯示既有儲存錯誤提示。

本環境 npm run dev 遇到 dependency optimization 的目錄讀取限制；瀏覽器驗證使用 npm run build 後的 npm run preview，已成功驗證正式版。

## 第一次使用初始化調整
初始化位於 src/utils/store.js 的 migrateStore()：courses: data.courses ?? []。readStore() 的首次使用與 useStore 的安全 fallback 均沿用此邏輯。
本次修改：src/utils/store.js、src/utils/store.test.js、src/utils/courses.test.js、src/data/courses.js（legacy 註解）、src/components/WeeklySchedule.jsx、src/styles.css、本報告，以及 .qa/editable-courses-check.mjs 的新增課程按鈕定位。新增 .qa/empty-courses-check.mjs、.qa/empty-schedule-mobile.png；dist 重新建置。
Empty State 顯示 No courses yet / Add your first course to build your schedule. 與 ADD COURSE，保留細線及留白。
驗證：npm test 18/18、npm run build 成功；獨立瀏覽器 A–F 全部通過，涵蓋新使用者空課表、新增及 reload、既有 courses 保留、缺少 courses 時其他舊資料完整保留。
