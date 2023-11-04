const access_token = "";    // LINE Messaging API: チャンネルアクセストークン
const user_id = "";         // LINE ユーザーID
const calendar_id = "";     // Google カレンダーID
const spreadsheet_url = ""; // スプレッドシートのURL

function seededRandom(seed) {
  var x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function getMessagesFromSpreadsheet() {
  const sheet = SpreadsheetApp.openByUrl(spreadsheet_url).getActiveSheet();
  const messages_ = sheet.getRange("A:A").getValues(); // メッセージをA列に記述しておく
  const messages = messages_.flat().filter(Boolean);
  return messages;
}

function getRandomMessage(messages, today) {
  const seed = today.getTime();  // 現在時刻をseedとして使用
  const randomIndex = Math.floor(seededRandom(seed) * messages.length);
  return messages[randomIndex];
}

function convertHTMLToText(html) {
  // <br>を\nに変換
  html = html.replace(/<br>/g, "\n");
  // <b>hoge</b>をhogeに変換
  html = html.replace(/<b>(.*?)<\/b>/g, "$1");
  // <i>hoge</i>をhogeに変換
  html = html.replace(/<i>(.*?)<\/i>/g, "$1");
  // <u>hoge</u>をhogeに変換
  html = html.replace(/<u>(.*?)<\/u>/g, "$1");
  // <ol><li>hoge</li><li>foo</li></ol>を[i]. hoge\n[i+1]. foo\nに変換（[i]は連番）
  let counter = 1;
  html = html.replace(/<ol>(.*?)<\/ol>/g, function(match, list) {
    let items = list.match(/<li>(.*?)<\/li>/g);
    items = items.map(function(item) {
      let newItem = item.replace(/<li>(.*?)<\/li>/, function(match, content) {
        return `${counter}. ${content}`;
      });
      counter += 1;
      return newItem;
    });
    return items.join("\n")+"\n";
  });
  // <ul><li>hoge</li><li>foo</li></ul>を- hoge\n- foo\nに変換
  html = html.replace(/<ul>(.*?)<\/ul>/g, function(match, list) {
    return list.replace(/<li>(.*?)<\/li>/g, "- $1\n");
  });
  return html;
}

function getGoogleCalendar() {
  const today = new Date();
  const myCalendar = CalendarApp.getCalendarById(calendar_id);
  const myEvents = myCalendar.getEventsForDay(today);
  const randomMessage = getRandomMessage(getMessagesFromSpreadsheet(), today);

  let message;

  if (myEvents.length === 0) {
    message = `今日までタスクはないよ!\n${randomMessage}`;
  } else {
    const taskCount = myEvents.length;
    message = `まだ${taskCount}つ${taskCount > 1 ? "も" : ""}タスクが残っているよ!\n\n`;
    
    message += myEvents.map((event, index) => {
      const deadlineTime = Utilities.formatDate(event.getStartTime(), "JST", "HH:mm") === "00:00" ? "今日" : Utilities.formatDate(event.getStartTime(), "JST", "HH:mm");
      const title = event.getTitle().replace(/<[^>]*>/g, "");
      const description = convertHTMLToText(event.getDescription());
      return `${index > 0 ? "\n-----------------\n" : ""}✅${title}\n${description}\n${deadlineTime}までだからね`;
    }).join("");
  }

  postMessage(message);
}

// LINEにメッセージを送信するためのメソッド
function postMessage(message) {
  const url = "https://api.line.me/v2/bot/message/broadcast";
  const headers = {
    "Content-Type": "application/json; charset=UTF-8",
    "Authorization": `Bearer ${access_token}`
  };

  const postData = {
    to: user_id,
    messages: [
      {
        type: "text",
        text: message,
      },
    ],
  };

  const options = {
    method: "post",
    headers: headers,
    payload: JSON.stringify(postData),
  };

  return UrlFetchApp.fetch(url, options);
}
