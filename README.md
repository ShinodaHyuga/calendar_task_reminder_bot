# calendar_task_reminder_bot

## 概要

大学1年の時にお遊びで作ったLINE BOTです。

LINE Messaging API、Googleカレンダー、およびGoogle Apps Script（GAS）を統合したプロジェクトです。このボットはGoogleカレンダー内のタスク情報を収集し、LINEを介してユーザーに通知します。サーバーを立てるのが面倒だったため、GASを使用して実装しました。

LINE Devとかの使い方は省略します。

### 実行例

![Googleカレンダー](https://github.com/ShinodaHyuga/calendar_task_reminder_bot/blob/images/calendar.png)
![LINE](https://github.com/ShinodaHyuga/calendar_task_reminder_bot/blob/images/line.png)

## トークンやらIDやらの取得方法

### 1. `access_token`

- LINE Developers
- トップ > {ユーザ名} > {BOT名} > Messaging API設定の**チャネルアクセストークン**

### 2. `user_id`

- LINE
- 設定 > **ID**

### 3. `calendar_id`

- Google Calendar
- 設定 > カレンダーの統合 > **カレンダーID**

### 4. `spreadsheet_url`

- Google Sheets
- 共有 > リンクをコピー

## About メスガキモード

スプレッドシートに以下のようなセリフを記述してください。セリフはランダムに選択されます。

- A列
  - タスクが終わった（ない）時のセリフ
  - 例：おにーさん、仕事が終わったんだね♡すごいじゃん！まあ、当たり前のことだけどwww
- B列
  - タスクが残っている時のセリフ（文頭）
  - 例：仕事が残ってるのは、おにーさんがズボラだからかな？ば〜か♡
- C列
  - タスクが残っている時のセリフ（文末）
  - 例：ほらほら、もっと頑張ってよ！こんなんじゃ仕事終わらないよ？♡

## バージョン履歴

- Ver. 1.0
  - 初期リリース
- Ver. 1.1
  - メッセージをスプレッドシートから読み取れるように修正
  - ver. 1.1.1
    - 細かいプログラムの修正
- Ver. 2.0
  - メスガキモード実装
