const { Server } = require("socket.io");
const { connectRedis } = require('../config/redis');
const { connectKafka } = require('../config/kafka');
const chatService = require('../services/chatService');
const logger = require('../utils/logger');

module.exports = async (server) => {
    const redisClient = await connectRedis()
    const {kafka, producer} = await connectKafka()

    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.use((socket, next) => {
        const userId = socket.handshake.auth.userId;
        if (!userId) {
            return next(new Error("invalid userId"));
        }
        socket.userId = userId;
        next();
    });

    io.on('connection', (socket) => {
        console.log('a user connected', socket.userId);
        redisClient.sAdd('onlineUsers', socket.userId);
        socket.broadcast.emit('user online', socket.userId)

        socket.on('join private room', async (recipientId) => {
            socket.join(recipientId);

            const subscriber = redisClient.duplicate();
            subscriber.connect().catch(console.error);

            subscriber.subscribe(`private:${socket.userId}`, async (message) => {
                try {
                    const messageData = JSON.parse(message);
                    socket.emit('new private message', messageData)

                    if(messageData.recipient === socket.userId){
                        await chatService.markMessageAsRead(messageData._id)
                    }
                } catch (error) {
                    logger.error("Error parsing message from Redis:", error);
                }
            })

            const messages = await chatService.getMessages(socket.userId, recipientId, 1, 50)
            socket.emit('load old messages', messages)
        })

        socket.on('leave private room', (recipientId) => {
            socket.leave(recipientId);
        })

        socket.on('private message', async (messageData) => {
            try {
                messageData.sender = socket.userId
                const savedMessage = await chatService.saveMessage(messageData);
                messageData._id = savedMessage._id
                redisClient.publish(`private:${messageData.recipient}`, JSON.stringify(messageData));

                await producer.send({
                    topic: 'chat-messages',
                    messages: [{ key: messageData.recipient, value: JSON.stringify(messageData) }],
                });

                io.to(messageData.recipient).emit('new private message', messageData)
                socket.emit('messageSent', { messageId: messageData._id });
            } catch (error) {
                console.error("Error sending message:", error);
            }
        });

        socket.on('message read', async (messageId) => {
            try {
                const message = await chatService.markMessageAsRead(messageId)
                io.to(message.sender.toString()).emit('message read', messageId)
            } catch (error) {
                console.error("Error marking message as read:", error);
            }
        });

        socket.on('update message', async (messageData) => {
            try {
                const message = await chatService.updateMessage(messageData._id, messageData.content)
                redisClient.publish(`private:${message.recipient}`, JSON.stringify(message));

                await producer.send({
                    topic: 'chat-messages',
                    messages: [{ key: message.recipient, value: JSON.stringify(message) }],
                });
                io.to(message.recipient.toString()).emit('message updated', message)
            } catch (error) {
                console.error("Error updating message:", error);
            }
        });

        socket.on('delete message', async (messageId) => {
            try {
                const message = await chatService.deleteMessage(messageId)
                redisClient.publish(`private:${message.recipient}`, JSON.stringify(message));

                await producer.send({
                    topic: 'chat-messages',
                    messages: [{ key: message.recipient, value: JSON.stringify(message) }],
                });
                io.to(message.recipient.toString()).emit('message deleted', message)
            } catch (error) {
                console.error("Error deleting message:", error);
            }
        });

        socket.on('disconnect', () => {
            console.log('user disconnected', socket.userId);
            redisClient.sRem('onlineUsers', socket.userId);
            socket.broadcast.emit('user offline', socket.userId)
        });
    });

    return io;
};