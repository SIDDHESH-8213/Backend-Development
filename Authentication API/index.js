const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/Users");
const authmiddleware = require("./authmiddleware");
const errorHandler = require("./errorhandler");
const port = 3000;

app.use(express.json());
app.use(errorHandler)

mongoose.connect("mongodb://localhost/userauth", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection;

db.on('error', console.error.bind(console, "MongoDb Connection Error:"))

db.once('open', ()=>{
    console.log('connected to MongoDb');
})

app.get('/', (req, res) =>{
    res.send("Hello World")
})

app.post('/register', async (req, res) =>{
    const {username, email, password} = req.body;

    try{
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: "User already exists"})
        }

        const newUser = new User({username, email, passwordHash: password})
        await newUser.save();

        res.status(201).json({message: "user registration sucessful"});
    }
    catch(err){
        console.error('Error registering user:', err);
        res.status(500).json({message: "Failed to register user"});
    }
    
})

app.post('/login', async (req, res) =>{
    const {email, password} = req.body;

    try{
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({message: "No such User"})
        }

        const isPasswordMatch = await bcrypt.compare(password, user.passwordHash)

        if(!isPasswordMatch) {return res.status(401).json({message: "Incorrect Password"})}

        const token = jwt.sign({userId: user._id}, 'secret',{expiresIn: '1h'});

        res.json({token});
    } catch(err){
        console.error("Error logging in user", err)
        res.status(500).json({message: "Failed to log in user"})
    }
});

app.get("/profile", authmiddleware ,(req, res) =>{
    res.json({message: "Profile accessed successfully"})
})

app.post("/logout", authmiddleware, (req, res)=>{
    res.json({message: "Logged out successfully"})
})

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})