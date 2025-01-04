const { Kafka } = require('kafkajs');
const logger = require('../utils/logger');

let kafka;
let producer;
let admin;

async function connectKafka() {
    try {
        kafka = new Kafka({
            clientId: 'chat-app-backend',
            brokers: process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : ['localhost:9092'],
        });
        admin = kafka.admin();
        await admin.connect()
        await admin.createTopics({
            topics: [{ topic: 'chat-messages', numPartitions: 1, replicationFactor: 1 }],
        });
        await admin.disconnect()
        producer = kafka.producer();
        await producer.connect();
        logger.info('Connected to Kafka and created topic');
    } catch (error) {
        logger.error('Error connecting to Kafka:', error);
        process.exit(1)
    }

    return {kafka, producer}
}


module.exports = { connectKafka };