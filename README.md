# FakeBook
## 1. 架構
![架構圖](https://i.imgur.com/2oFxN9E.png)
## 2. 使用工具
* MongoDB Altas
* Express
* React
* Node.js
* CSS : Scss
* UI/ICON : MUI
## 3. 功能說明
### 3-1 此網站為借鑒舊FaceBook之頁面所建立的社群網站，功能包含以下所列 :
1. 註冊/登入/登出
2. 跟隨使用者
3. 修改個人資訊 (包括封面照片、大頭貼)
4. 貼文 (文字和圖片)
5. 貼文按讚、留言 (可排序)
6. 上線系統
7. 即時通知
8. 即時聊天 (文字和圖片)
### 3-2 細部說明
1. 大致分為三部分: Client, Resutful Api, Socket
2. Cilent為前端UI的呈現，與APi串聯
3. Socket提供了上線功能，實現即時的通知與聊天
4. ** 為什麼我稱為"不完全的Rest Api"? **
