'use strict';

/*
 * Redis Node Script
 * https://www.npmjs.com/package/redis
 */
 
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

const userId  = "jfaioejifjaoifajsn"
const groupId = "faijdjfoisajisjfiajo"

client.hmset("hosts", "userId", userId,'EX', 1);
client.hgetall("hosts", function (err, obj) {
    console.dir(obj["userId"]);
});

client.quit()

client.hkeys("userId", function (err, replies) {
    console.log(replies.length + " replies:");
    replies.forEach(function (reply, i) {
        console.log("    " + i + ": " + reply);
    });
    client.quit();
});



client.hmset(["userId", userId, "groupId", groupId], function (err, res) {
  console.log(res);
});

client.hkeys("userId", function (err, replies) {
    console.log(replies.length + " replies:");
    replies.forEach(function (reply, i) {
        console.log("    " + i + ": " + reply);
    });
    client.quit();
});


client.hset("userId", userId, "some value", redis.print);
client.hset(["hash key", "hashtest 2", "some other value"], redis.print);

client.set("string key", 'hoge', redis.print);
client.get("string key", redis.print);
client.quit();
