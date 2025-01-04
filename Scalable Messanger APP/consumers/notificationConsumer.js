const { Kafka } = require('kafkajs');
const logger = require('./utils/logger');

const notificationService = {
    sendNotification: (message) => {
        logger.info(`Sending notification: ${JSON.stringify(message)}`);
    },
};

async function runNotificationConsumer() {
    try {
        const kafka = new Kafka({
            clientId: 'chat-app-notification-consumer', 
            brokers: process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : ['localhost:9092'],
        });

        const consumer = kafka.consumer({ groupId: 'chat-notification-group' }); 

        await consumer.connect();
        await consumer.subscribe({ topic: 'chat-messages', fromBeginning: true });

        await consumer.run({
            eachMessage: async ({ message }) => {
                try {
                    const messageData = JSON.parse(message.value.toString());

                    
                    notificationService.sendNotification(messageData);

                } catch (error) {
                    logger.error('Error processing message for notification:', error);
                   
                }
            },
        });
    } catch (error) {
        logger.error('Error running Kafka notification consumer:', error);
    }
}

module.exports = runNotificationConsumer;