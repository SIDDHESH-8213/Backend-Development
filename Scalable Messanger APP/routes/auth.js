const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
const logger = require('../utils/logger');

router.post('/register', async (req, res) => {
    try {
        const user = await authService.registerUser(req.body);
        res.status(201).json({ message: "User created", user });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const token = await authService.loginUser(req.body);
        res.json({ token });
    } catch (error) {
        logger.error(error);
        res.status(401).json({ message: error.message });
    }
});

module.exports = router;