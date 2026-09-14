# Space Name 與 Weekly Schedule 管理模式

本次只修改目前 MY SPACE 專案。

## 修改檔案
- src/App.jsx：移除 Navigation 的 M/S 與 Hero 固定大三上；接上 SpaceHeader；共用刪除流程提供给課表，區分無關聯資料／有關聯資料／檔案讀取失敗的確認文字，增加刪除處理中狀態。
- src/components/WeeklySchedule.jsx：EDIT / MANAGE ↔ DONE；每個課程時段區塊內直接 EDIT、DELETE；保留封存清單／RESTORE、day tabs、空課表、ADD COURSE。
- src/utils/store.js：displaySpaceName() 提供安全顯示 fallback；原 migration 與 courses=[] 初始化不變。
- src/styles.css：Navigation 靠右、長名稱響應式排版、低調 EDIT NAME，以及桌面／手機管理模式。
- .qa/editable-courses-check.mjs：課程導覽改為明確點擊區塊中的連結，避免與管理按鈕混淆。
- dist/：build 重新產生。

## 新增檔案
- src/components/SpaceHeader.jsx：大型標題及按需開啟的名稱編輯介面。
- src/utils/spaceName.test.js：缺失／空白／非字串名稱 fallback 與儲存資料保留測試。
- .qa/space-manage-check.mjs：新功能的瀏覽器整合測試。
- .qa/space-name-1365.png、.qa/space-name-390.png、.qa/manage-mobile.png：獨立測試瀏覽器截圖。
- SPACE-MANAGEMENT-REPORT.md：本報告。
既有 .qa 測試畫面隨回歸測試重新產生。

## 行為與資料
M/S 連結直接從 nav JSX 移除，Navigation 僅保留 OVERVIEW、MY TASKS、SCHEDULE；以 flex-end 對齊。固定學期文字由原 Hero 移除，保留 WORK / STUDY / LIFE。

spaceName 放在同一個 my-space.v1 物件；SAVE 使用 setData(d => ({...d,spaceName}))，沿用 useStore 的保存及錯誤提示。沒有新 storage key。缺失、空白或非字串只在顯示時 fallback MY SPACE，不修改其他資料。使用者點 EDIT NAME 才開啟 Space Name／SAVE／CANCEL 對話框；SAVE 去除首尾空白，全空白則顯示錯誤；CANCEL 或 Escape 不保存。支援中文、英文、數字，長文字自動換行且手機縮放，不強制 onboarding。

管理模式由 WeeklySchedule 的 managing state 控制；啟用時每堂課的每個上課時段都有 EDIT／DELETE，DONE 後全部隱藏。管理時依星期與開始時間排列，區塊自然展開高度，使短時段課程也能容納完整名稱和操作；一般模式恢復原時間軸。手機維持 Day Tabs。

EDIT 直接使用 App 的既有 CourseEditor，保留 multiple time slots、同一個 saveCourse() 與固定 ID。DELETE 直接使用 App 的既有 deleteCourse()，讀取 IndexedDB PDF 數量，確認後呼叫 archiveCourse()。刪除只設定 archived:true，TODAY／Weekly Schedule 立即移除，refresh 仍保留封存。封存課程的 Detail route 仍正常顯示保留資料與 RESTORE COURSE。

Course ID 不變。Tasks／Exams／Notes／details／PDF 不重新建立、不清空。檔案讀取失敗時仍明確告知並採保留處理。未改 IndexedDB 設計、Exam 提醒、跨午夜邏輯、統一 Tasks、Quick Task 或其他分類。沒有初始化舊個人課表。唯一新的持久欄位是使用者儲存的 spaceName。

## 驗證
npm test：19/19 通過。
npm run build：成功。
新瀏覽器測試：缺失名稱 fallback、EDIT NAME／SAVE／CANCEL、空白防呆、二次改名、refresh、中英長名稱桌面及手機無水平溢出、無 M/S／固定學期／Navigation selector、保留標語、管理模式進出、多時段、新增／直接改名與移動星期、ID 不變、直接刪除取消／確認、空課程簡短確認、有 Tasks／Exams／Notes／PDF 警告、資料保留、封存 refresh、封存 route、TODAY 即時移除、跨午夜與手機按鈕操作。
既有瀏覽器回歸涵蓋初始化空課表、Course CRUD、PDF、統一 Tasks、Quick Task、其他分類。所有測試使用獨立瀏覽器 context，未操作使用者實際 localStorage。
