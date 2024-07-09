const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.post('/register', async (req, res) =>{
    const {userName, email, password} = req.body;

    try{
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message : "User already exists"});
        }

        const user = new User({userName, email, passwordHash: password});
        await user.save();
        res.status(201).json({message: `User registerd sucessfully`})
    }
    catch(error){
        console.error(`Error registering the user`)
        res.status(500).json({message: `Failed to register User`})
    }
});

router.post('/login', async (req, res) =>{
    const {email, password} = req.body;

    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message: `User not found`})
        }
        const passwordMatch = await bcrypt.compare(password, user.passwordHash);
        if(!passwordMatch){
            res.status(401).json({message: `Invalid credentials`})
        }

        const token = jwt.sign({userId: user._id}, 'secret', {expiresIn: '1h'});
        res.json({token});
    }
    catch(error){
        console.error(`Error logging in the user`);
        res.json(500).json({message: `Failed to log in user`});
    }
});

module.exports = router;