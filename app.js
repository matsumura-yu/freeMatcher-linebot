const express = require('express');
const line = require('@line/bot-sdk');
process.on('unhandledRejection', console.dir);
require('dotenv').config();

const config = {
    channelSecret: process.env.CHANNEL_SECRET,
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
};

const app = express();

app.post('/webhook', line.middleware(config), (req, res) => {
    Promise
      .all(req.body.events.map(handleEvent))
      .then((result) => res.json(result));
});

const client = new line.Client(config);

// listを操作するためのasync
async function asyncMap(array, operation) {
    return Promise.all(array.map(async item => await operation(item)))
}

async function getDisplayName(client, userId) {
  const profile = await client.getProfile(userId);
  const displayName = profile.displayName;
  console.log(displayName); // TODO: 確認次第消す

  return displayName;
}

async function handleEvent(event) {
    // グループチャットを切る
    // if (event.type !== 'message' || event.message.type !== 'text' || event.source.type == 'group') {
    //     return Promise.resolve(null);
    // }
    console.log('---------------')
    console.log(event)
    console.log('---------------')
    // コネクションをはる
    const redisClient = require('redis').createClient(process.env.REDIS_URL);

  // userId取得
    const userId = event.source.userId;
    const reqMessage = event.message.text
    const groupId = event.source.groupId;
    
    // 個別チャットではundefinedになる
    console.log(groupId)
    const displayName = await getDisplayName(client, userId);

    switch(reqMessage){
    case "行ける":
        if(groupId == undefined){
            return client.replyMessage(event.replyToken,{
                type: 'text',
                text: "申し訳ありません。現在この機能はグループ内でのみ利用可能です。"
            })
        }
        
        console.log("groupIDが存在")
        //redisClient.sadd("userIds",userId)
        
        // groupIDでとる処理
        redisClient.sadd(groupId, userId)
        redisClient.quit();

        return client.replyMessage(event.replyToken,{
            type: 'text',
            text: displayName + "さんは戦いたがっています。"
        })
    
    case "落ちる":
        if(groupId == undefined){
            return client.replyMessage(event.replyToken,{
                type: 'text',
                text: "申し訳ありません。現在この機能はグループ内でのみ利用可能です。"
            })
        }
        console.log("groupIDが存在")
        // userId取得
        //redisClient.srem("userIds",userId)
        redisClient.srem(groupId, userId)
        redisClient.quit();
        
        return client.replyMessage(event.replyToken,{
            type: 'text',
            text: displayName + 'さんは待機を辞めます。'
        })
    
    case "誰か":
        if(groupId == undefined){
            return client.replyMessage(event.replyToken,{
                type: 'text',
                text: "申し訳ありません。現在この機能はグループ内でのみ利用可能です。"
            })
        }
        console.log("groupIDが存在")

        // const standUserIds = await redisClient.smembers("userIds")
        // async awaitでの書き換え失敗

        await redisClient.smembers(groupId, function (err, userIds) {
            let replayMessage = ""
            if(!err){
                console.log(userIds);
                
                const displayNames = asyncMap(userIds, async userId => {
                    const response = await getDisplayName(client, userId);
                    console.log("resoponse", response)
                    return response
                }).then(result => {
                    console.log(result);
                    replayMessage = '待機状態の人をお知らせします。\n' + result.join("\n")
                    client.replyMessage(event.replyToken,{
                        type: 'text',
                        text: replayMessage
                    })
                })
                
                // こいつが上より早く処理されてしまう
                // promise<pending>
                //console.log(displayNames)
                // replayMessage = '待機状態の人をお知らせします。\n' // + displayNames.join("\n")
                // client.replyMessage(event.replyToken,{
                //     type: 'text',
                //     text: replayMessage
                // })
            }else{
                console.log("エラー" , err)
                replayMessage = "予期せぬエラーが発生しました。"
                client.replyMessage(event.replyToken,{
                    type: 'text',
                    text: replayMessage
                })
            }

        })
        //認証済みLINE@でないと使えない機能
        //const groupUserIds = await client.getGroupMemberIds(groupId)
        //const groupUserIdTest = groupUserIds.join('\n')
        redisClient.quit()
        return true
    case "ヘルプ":
        return client.replyMessage(event.replyToken,{
            type: 'text',
            text: 'このBotが出来ることを教えます。'
        })
    case "意見":
        return client.replyMessage(event.replyToken,{
            type: 'text',
            text: '何か開発者に意見をお願いします。'
        })

    case "deleteAll":
        redisClient.flushall(function(err, succeeded){
            console.log(succeeded);

        })
        redisClient.quit();
    default:
        console.log(reqMessage)
        // TODO:式実行して変数に代入しながらif文かけたい
        if(reqMessage.match(/(\d+)月(\d+)日/) == null){
            //result = s.match( /\D+(\d+)年(\d+)月(\d+)日/ )
            console.log('現在ここ')
            return Promise.resolve(null);
        }else{
            let result = reqMessage.match(/(\d+)月(\d+)日/)
            let month = result[1]
            let day = result[2]
            // 次の日
            let nextDay = String(Number(day) + 1)
            let startDate = '2018' + month + day
            let endDate = '2018' + month + nextDay
            var createEvent = require('./createEvent')
            let url = createEvent(startDate, endDate)
            console.log(url)

            return client.replyMessage(event.replyToken,{
                type: 'text',
                text: url
            })

        }
        
        
  }
  
  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: event.message.text //実際に返信の言葉を入れる箇所
  });
}

module.exports = app
