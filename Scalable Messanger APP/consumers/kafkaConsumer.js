const { Kafka } = require('kafkajs');
const mongoose = require('mongoose'); 
const Message = require('./models/message'); 
const logger = require('./utils/logger');

async function runKafkaConsumer() {
    try {
        const kafka = new Kafka({
            clientId: 'chat-app-consumer', 
            brokers: process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : ['localhost:9092'],
        });

        const consumer = kafka.consumer({ groupId: 'chat-message-group' }); 

        await consumer.connect();
        await consumer.subscribe({ topic: 'chat-messages', fromBeginning: true }); 

        await consumer.run({
            eachMessage: async ({ message }) => {
                try {
                    const messageData = JSON.parse(message.value.toString());

                    const existingMessage = await Message.findById(messageData._id);

                    if (!existingMessage) {
                        const mongoMessage = new Message(messageData)
                        await mongoMessage.save();
                        logger.info(`Message persisted to MongoDB: ${mongoMessage._id}`);
                    } else {
                        logger.warn(`Duplicate message received from Kafka: ${messageData._id}`);
                    }
                } catch (error) {
                    logger.error('Error processing message from Kafka:', error);
                }
            },
        });
    } catch (error) {
        logger.error('Error running Kafka consumer:', error);
    }
}

module.exports = runKafkaConsumer;