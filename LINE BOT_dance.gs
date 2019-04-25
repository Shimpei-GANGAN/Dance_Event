// LINE developersのメッセージ送受信設定に記載のアクセストークン
var CHANNEL_ACCESS_TOKEN = '<LINE Botのアクセストークン>';
var spreadsheet_id = '<スプレッドシートのId>';  //  スプレッドシートのid

//  ボットにメッセージを送信したときの処理
function doPost(e) {
  var replyToken = JSON.parse(e.postData.contents).events[0].replyToken;  // WebHookで受信した応答用Token
  var userMessage = JSON.parse(e.postData.contents).events[0].message.text;  // ユーザーのメッセージを取得
  var url = "https://api.line.me/v2/bot/message/reply";  // 応答メッセージ用のAPI URL

  var replyMessage = "";
  var help = "ソロのリストを確認する場合は「リスト ソロ」、2on2のリストを確認するときは「リスト 2on2」、使い方が分からないときは「ヘルプ」を入力して下さい";
  switch(userMessage){
    case "ヘルプ":
      replyMessage += help;
      break;
    case "リスト 2on2":
      replyMessage = getsheet2on2();
      break;
    case "リスト ソロ":
      replyMessage = getsheetsolo();
      break;
    default:
      replyMessage += help;
      break;
  }
  
  UrlFetchApp.fetch(url, {
    "headers": {
      "Content-Type": "application/json; charset=UTF-8",
      "Authorization": "Bearer " + ACCESS_TOKEN,
    },
    "method": "post",
    "payload": JSON.stringify({
      "replyToken": replyToken,
      "messages": [{
        "type": "text",
        "text": replyMessage,
      }],
    }),
  });
  return ContentService.createTextOutput(JSON.stringify({"content": "post ok"})).setMimeType(ContentService.MimeType.JSON);
}

//  ソロのリストを取得
function getsheetsolo(){
  var spreadsheet = SpreadsheetApp.openById(spreadsheet_id);
  var sheet = spreadsheet.getSheets()[4];  //  ソロのリストを取得
  var values = sheet.getRange("A:C").getDisplayValues();
  var range = sheet.getRange("B:B").getValues();  //  Stringのある範囲を指定
  var LastRow = range.filter(String).length;
  var body = "";
  for (var i = 1; i < LastRow; i++){
    body += values[i][0] + "." + values[i][1] + "(" + values[i][2] + ")\n";
  }
  Logger.log(body);
  return body;
}

//  2on2のリストを取得
function getsheet2on2(){
  var spreadsheet = SpreadsheetApp.openById(spreadsheet_id);
  var sheet = spreadsheet.getSheets()[3];  //  2on2のリストを取得
  var values = sheet.getRange("A:D").getDisplayValues();
  var range = sheet.getRange("B:B").getValues();  //  Stringのある範囲を指定
  var LastRow = range.filter(String).length;
  var body = "";
  for (var i = 1; i < LastRow; i++){
    body += values[i][0] + "." + values[i][1] + "(" + values[i][2] + "/" + values[i][3] + ")\n";
  }
  Logger.log(body);
  return body;
}