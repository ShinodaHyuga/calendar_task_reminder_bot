const access_token = "";  // LINE Messaging API: チャンネルアクセストークン
const user_id = "";       // LINEユーザーID
const calendar_id = "";   // GoogleカレンダーID

function seededRandom(seed) {
  var x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function convertHTMLToText(html) {
  // <br>を\nに変換
  html = html.replace(/<br>/g, '\n');
  // <b>hoge</b>をhogeに変換
  html = html.replace(/<b>(.*?)<\/b>/g, '$1');
  // <i>hoge</i>をhogeに変換
  html = html.replace(/<i>(.*?)<\/i>/g, '$1');
  // <u>hoge</u>をhogeに変換
  html = html.replace(/<u>(.*?)<\/u>/g, '$1');
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
    return items.join('\n')+'\n';
  });
  // <ul><li>hoge</li><li>foo</li></ul>を- hoge\n- foo\nに変換
  html = html.replace(/<ul>(.*?)<\/ul>/g, function(match, list) {
    return list.replace(/<li>(.*?)<\/li>/g, '- $1\n');
  });
  return html;
}

function getGoogleCalendar() {
  const today = new Date();
  const seed = today.getTime();  // 現在時刻をseedとして使用
  const myCalendar = CalendarApp.getCalendarById(calendar_id);
  const myEvents = myCalendar.getEventsForDay(today);
  let message = "";

  // タスクが残っていなかった時のランダムメッセージ
  const randomMessages = [
    "おつかれさま！今日も頑張ったね！ 💪",
    "おつかれさまー！君の努力に感心だよ！ 😊",
    "おつかれさま☆君の一生懸命な姿が素敵だよ！ 🌟",
    "おつかれ！いつも君の頑張りに刺激を受けてるよ！ 💫",
    "おつかれさまっ！君のエネルギーに元気もらってるよ！ 🎉",
    "お疲れ様～！君の笑顔が最高だね！ 😄",
    "お疲れさま♪君のやる気にあこがれてるよ！ 🌸",
    "おつかれ！君のポジティブさは感染力抜群だよ！ 🌞",
    "おつかれさまっ！君の友達でいられて嬉しいな！ 😁",
    "おつかれさまっす！君の一生懸命な態度が尊敬だよ！ 🙌",
    "お疲れ様！君の頑張りには本当に感謝しています！ 🌼",
    "お疲れ様っ！君の努力が明るい未来を作り出しているよ！ 🌠",
    "お疲れさまー！君の一生懸命さはみんなに元気を与えているよ！ 💖",
    "おつかれさま！君のパフォーマンスはいつも素晴らしい！ 🌈",
    "お疲れ様☆君のポジティブなエネルギーが最高だね！ 🚀",
    "おつかれ！君の仕事ぶりは絶えず驚かせてくれるよ！ 🎈",
    "おつかれさま♪君の笑顔は最高の癒しだよ！ 😇",
    "お疲れ！君の一生懸命さに感動しています！ 🌻",
    "おつかれさま☆君の力強い姿勢は尊敬に値するよ！ 💪",
    "お疲れ様！君との時間はいつも楽しいよ！ 😄"
  ];

  if (myEvents.length === 0) {
    message = "今日までのタスクはないよ!\n";
    message += `${randomMessages[Math.floor(seededRandom(seed) * randomMessages.length)]}`;
  } else {
    if (myEvents.length === 1) {
      message = `まだ${myEvents.length}つだけタスクが残っているよ!\n\n`;
    } else if (myEvents.length === 2) {
      message = `まだ${myEvents.length}つのタスクが残っているよ!\n\n`;
    } else {
      message = `まだ${myEvents.length}つもタスクが残っているよ!\n\n`;
    }
    let firstEvent = true; // 最初のタスクの区切り線を追加するためのフラグ
    myEvents.forEach(function (event) {
      let deadlineTime = Utilities.formatDate(event.getStartTime(), "JST", "HH:mm");
      if (deadlineTime === "00:00") {
        deadlineTime = "今日";
      }
      if (event.getTitle()) {
        const title = event.getTitle().replace(/<[^>]*>/g, ''); // HTMLタグを削除
        const description = convertHTMLToText(event.getDescription());

        if (!firstEvent) {
          message += "\n-----------------\n"; // 区切り線を追加
        }
        message += `✅${title}\n${description}`;
        message += `\n${deadlineTime}までだからね`;
        firstEvent = false;
      }
    });
  }

  return postMessage(message);
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
