const Message = require('../models/message');

const chatService = {
    async getMessages(senderId, recipientId, page, limit) {
        try {
            const messages = await Message.find({
                $or: [
                    { sender: senderId, recipient: recipientId },
                    { sender: recipientId, recipient: senderId },
                ],
            })
                .sort({ timestamp: 1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .populate('sender', 'username')
                .populate('recipient', 'username');
            return messages;
        } catch (error) {
            throw error;
        }
    },
    async saveMessage(messageData) {
        try {
            const message = new Message(messageData);
            await message.save();
            return message;
        } catch (error) {
            throw error;
        }
    },
    async markMessageAsRead(messageId) {
        try {
            const message = await Message.findByIdAndUpdate(messageId, { read: true }, { new: true });
            return message;
        } catch (error) {
            throw error;
        }
    },
    async updateMessage(messageId, newContent) {
        try {
            const message = await Message.findByIdAndUpdate(messageId, { content: newContent, updated: true }, { new: true });
            return message;
        } catch (error) {
            throw error;
        }
    },
    async deleteMessage(messageId) {
        try {
            const message = await Message.findByIdAndUpdate(messageId, { deleted: true }, { new: true });
            return message;
        } catch (error) {
            throw error;
        }
    },
};

module.exports = chatService;