# calendar_task_reminder_bot

## 概要

大学1年の時にお遊びで作ったLINE BOTです。

LINE Messaging API、Googleカレンダー、およびGoogle Apps Script（GAS）を統合したプロジェクトです。このボットはGoogleカレンダー内のタスク情報を収集し、LINEを介してユーザーに通知します。サーバーを立てるのが面倒だったため、GASを使用して実装しました。

LINE Devとかの使い方は省略します。

## トークンやらIDやらの取得方法

### 1. access_token

- LINE Developers
- トップ > {ユーザ名} > {BOT名} > Messaging API設定の**チャネルアクセストークン**

### 2. user_id

- LINE
- 設定 > **ID**

### 3. calendar_id

- Google Calendar
- 設定 > カレンダーの統合 > **カレンダーID**

## TODO

- `Logger.log()`消す
- データをjsonから引っ張れるようにする
