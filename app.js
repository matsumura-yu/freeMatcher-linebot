const express = require('express');
const line = require('@line/bot-sdk');
const redisClient = require('redis').createClient(process.env.REDIS_URL);
require('dotenv').config();

const config = {
    channelSecret: process.env.CHANNEL_SECRET,
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
};

const app = express();

app.post('/webhook', line.middleware(config), (req, res) => {
    console.log(req.body.events);
    Promise
      .all(req.body.events.map(handleEvent))
      .then((result) => res.json(result));
});

const client = new line.Client(config);

function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text' || event.source.type == 'group') {
    return Promise.resolve(null);
  }

  const reqMessage = event.message.text
  switch(reqMessage){
    case "スタンド":
        // userId取得
        const userId = event.source.userId;

        redisClient.sadd("userList", userId);
        //const userList = redisClient.get("userList", redisClient.print);

        redisClient.quit();
        return client.replyMessage(event.replyToken,{
            type: 'text',
            text: 'あなたは待機状態になりました'
        })
    case "キャッチ":
        return client.replyMessage(event.replyToken,{
            type: 'text',
            text: '待機状態の人をお知らせします'
        })
    case "ヘルプ":
        return client.replyMessage(event.replyToken,{
            type: 'text',
            text: 'このBotが出来ることを教えます'
        })
    case "意見":
        return client.replyMessage(event.replyToken,{
            type: 'text',
            text: '何か開発者に意見をお願いします'
        })
  }
  
  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: event.message.text //実際に返信の言葉を入れる箇所
  });
}

module.exports = app
