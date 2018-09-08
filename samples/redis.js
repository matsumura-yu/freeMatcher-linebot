'use strict';


/*
 * Redis Node Script
 * https://www.npmjs.com/package/redis
 */
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

client.set("string key", 'hoge', redis.print);
client.get("string key", redis.print);

client.quit();
