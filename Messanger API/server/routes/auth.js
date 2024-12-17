const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async(req, res) =>{
  const {username, password} = req.body;
  try{
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({username, password: hashedPassword});
    res.status(201).json({message: "User registered successfully"});
  }
  catch(err){
    res.status(500).json({error: err.message});
  }
});

router.post("/login", async(req, res)=>{
  const {username, password} = req.body;
  try{
    const user = await User.findOne({username});
    if(!user) return res.status(404).json({message: `${username} not found`});

    const ismatch = await bcrypt.compare(password, user.password);
    if(!ismatch){
      return res.status(400).json({message: "Invalid Password"})
    }
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1h"});
    res.json({token, user:{id: user._id, username: user.username }})
  }
  catch(err){
    res.status(500).json({error: err.message});
  }
});

module.exports = router;