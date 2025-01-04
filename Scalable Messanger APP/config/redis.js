const redis = require('redis');
const logger = require('../utils/logger');

let redisClient;

async function connectRedis() {
    try {
        redisClient = redis.createClient({ url: process.env.REDIS_URL });
        redisClient.on('error', (err) => logger.error('Redis Client Error', err));
        await redisClient.connect();
        logger.info('Connected to Redis');
    } catch (error) {
        logger.error('Error connecting to Redis:', error);
        process.exit(1)
    }
    return redisClient
}

module.exports = { connectRedis };