const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authService = {
    async registerUser(userData) {
        try {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            userData.password = hashedPassword;
            const newUser = new User(userData);
            await newUser.save();
            return newUser;
        } catch (error) {
            throw error;
        }
    },
    async loginUser(userData) {
        try {
            const user = await User.findOne({ username: userData.username });
            if (!user) {
                throw new Error('Invalid credentials');
            }

            const isMatch = await bcrypt.compare(userData.password, user.password);
            if (!isMatch) {
                throw new Error('Invalid credentials');
            }
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
            return token;
        } catch (error) {
            throw error;
        }
    },
};

module.exports = authService;