const User = require('../models/User');
const jwt  = require('jsonwebtoken');

exports.register = async (req, res) =>{
    try{
        const {userName, email, password} = req.body;
        const user = new User({userName, email, password});
        await user.save();
        res.status(201).json({message: `User registered successfully.`});
    }
    catch(error){
        res.status(400).json({error: error.message});
    }
}

exports.login = async (req, res) =>{
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user || !(await user.comparePassword(password))){
            res.status(401).json({message: `Invalid email or password`});
        }
        const token = jwt.sign({id: user._id}, 'your_jwt_secret', {expiresIn: `1h`});
        res.json({token});
    } catch(error){
        res.status(400).json({error: error.message});
    }   
};