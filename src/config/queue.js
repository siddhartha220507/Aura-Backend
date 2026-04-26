const { Queue } = require('bullmq');
const Redis = require('ioredis');

// Connect to Upstash Redis (Make sure REDIS_URL is in your .env)
const connection = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null // BullMQ requires this setting
});

// Create a Queue named 'FocusQueue'
const focusQueue = new Queue('FocusQueue', { connection });

module.exports = { focusQueue, connection };