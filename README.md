# MY SPACE

這是一個以學生使用情境為核心的個人課表與任務管理網站，協助整理課程、考試、待辦與日常筆記。

## 目前功能

- **Space Name**：自訂首頁名稱，支援中文與英文，可隨時透過 EDIT NAME 修改。
- **Weekly Schedule**：查看每週課表，支援 Add Course、Edit / Manage Course 與 Delete Course；手機可使用星期分頁。
- **Today**：顯示當天課程與今天到期的未完成任務。
- **My Tasks**：集中管理任務，依分類篩選、編輯、完成及刪除。
- **Upcoming Exams**：顯示進入提醒期間的考試與倒數。
- **Course Detail**：整合 Files、Exams、To-do 與 Notes。
- **Freelance**：管理接案工作階段、待辦與筆記。
- **Class Rep**：管理會議日期、議題、待辦、會議筆記與追蹤事項。
- **Personal Tasks**：管理個人日常待辦。

## 課程管理

首次使用從空課表開始，可透過 ADD COURSE 新增課程，設定 Course Name、Day、Start Time、End Time。

- EDIT / MANAGE 開啟管理模式，直接編輯或刪除課程；DONE 結束管理。
- 可修改課名、星期、開始時間與結束時間，課表立即更新。
- 課程 ID 固定，不因改名或調整時間而改變，任務、考試、筆記與 PDF 仍透過相同 ID 關聯。
- 刪除前需要確認；刪除後課程不再出現在一般 UI，相關資料仍保留於本機儲存，避免意外永久刪除。

## Task 系統

支援 **SCHOOL、FREELANCE、CLASS REP、PERSONAL** 四種分類。

Course Detail 與首頁共用同一份 Task data，新增、編輯、完成與刪除會立即同步。Quick Task 提供 Title、Deadline、Category 與選填 Notes。

## Exam 系統

- 可設定提前 **3 / 7 / 14 / 30 天**提醒，預設為 **14 天**。
- 倒數依實際日期顯示 **TODAY、TOMORROW、X DAYS LEFT**。
- Upcoming Exams 僅顯示有效課程中已進入提醒期間、且尚未過期的考試。

## Files 與 Storage

- **localStorage**：使用同一個 `my-space.v1` 保存 Space Name、課程、任務、考試、筆記與其他文字資料。
- **IndexedDB**：儲存 PDF Files，資料庫為 `my-space-files`，資料表為 `pdfs`，依課程 ID 關聯。
- PDF Blob 不使用 localStorage 儲存，可在課程頁上傳、開啟與刪除。
- 無 Backend、無登入、無雲端同步。

## 日期

使用瀏覽器實際日期，TODAY 依目前星期更新。首頁日期、課表與考試倒數共用日期狀態，支援跨午夜更新，返回分頁或視窗時也會重新校正。

## 技術

React、Vite、JavaScript、CSS、localStorage、IndexedDB。

## 使用方式

安裝 Node.js 與 npm 後，在專案目錄執行：

```sh
npm install
npm run dev
```

開啟終端機顯示的本機網址。

Windows PowerShell 如果 `npm.ps1` 被限制，可使用：

```powershell
npm.cmd run dev
```

## Build

```sh
npm run build
```

建置結果輸出至 `dist/`。

## 注意事項

目前資料只儲存在使用者瀏覽器本機，不同裝置之間不會自動同步。不同瀏覽器或網站來源亦不共用資料；清除網站儲存資料會移除本機保存內容。
