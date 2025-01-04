const express = require('express');
const router = express.Router();
const chatService = require('../services/chatService');
const logger = require('../utils/logger');

router.get('/messages/:recipientId', async (req, res) => {
    try {
        const senderId = req.user._id;
        const recipientId = req.params.recipientId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const messages = await chatService.getMessages(senderId, recipientId, page, limit);
        res.json(messages);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/messages', async (req, res) => {
    try {
        const messageData = {
            sender: req.user._id,
            recipient: req.body.recipient,
            content: req.body.content,
        };
        const savedMessage = await chatService.saveMessage(messageData);
        res.status(201).json(savedMessage);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.put('/messages/:messageId', async (req, res) => {
    try {
        const message = await chatService.updateMessage(req.params.messageId, req.body.content);
        res.json(message);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.delete('/messages/:messageId', async (req, res) => {
    try {
        await chatService.deleteMessage(req.params.messageId);
        res.status(204).send();
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;