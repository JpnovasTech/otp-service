require('dotenv').config();
const Redis = require('ioredis');


const client = new Redis({
    port: process.env.REDIS_ENDPOINT_PORT, // Redis port
    host: process.env.REDIS_ENDPOINT_URI, // Redis host
    username: "default", // needs Redis >= 6
    password: process.env.REDIS_PASSWORD,
    db: 0, // Defaults to 0
  });

// client.connect();

client.on('connect', function() {
    console.log('Connected to redis!');
});

client.on('error', err => {
    console.log('Error ' + err);
});


module.exports = { client }
