# FakeBook
## 1. 架構
![架構圖](https://i.imgur.com/2oFxN9E.png)
## 2. 使用工具
* MongoDB Altas
* Express
* React
* Node.js
* Socket.io
* CSS : Scss
* UI/ICON : MUI
* Test Client : PostMan
## 3. 功能說明
### 3-1 此網站為借鑒舊FaceBook之頁面所建立的社群網站，功能包含以下所列 :
1. 註冊/登入/登出
2. 跟隨使用者
3. 修改個人資訊 (包括封面照片、大頭貼)
4. 新增/刪除貼文 (文字和圖片)
5. 貼文按讚、留言 (可排序)
6. 上線系統
7. 即時通知 (已讀未讀)
8. 即時聊天 (文字和圖片)
####  更詳細可至我的個人網站觀看demo
### 3-2 細部說明
1. 大致分為三部分: Client, Resutful Api, Socket
2. Cilent為前端UI的呈現，與APi串聯
3. Client有四個page， Login, Register, Home, Profile, Messenger
4. 每個page再以各個不同的compoment組成
5. Socket提供了上線功能，實現即時的通知與聊天
6. React-Context實作Global state
### 3-3 為什麼我稱為"不完全的Rest Api"?
##### 1. 網站內提供了上傳檔案的功能，目前是以Multer+Path的方式上傳至Api，
##### 既然這是一個社群網站，上面會有數以萬計的使用者每天在貼文、傳訊息、更換照片等等...
##### 將這些檔案全部往Api裡面塞不是一個好主意，
##### 如果改用Amazon S3、Firebase等等的CDN Tools會比較理想。
##### 2. 沒有利用cache來增進效能
## 4. 改善空間
1. 承3-3所述，改為CDN Tools來儲存上傳資料
2. 利用cache來增進效能
3. 將context改為Redux或React Query
4. 更改排序和計算部分的算法 (如close friend, birthday)
