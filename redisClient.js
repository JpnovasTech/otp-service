require('dotenv').config();
const redis = require('redis');


const client = redis.createClient(process.env.REDIS_ENDPOINT_URI, {
    password: process.env.REDIS_PASSWORD,
});

client.connect();

client.on('connect', function() {
    console.log('Connected to redis!');
});

module.exports = { client }
