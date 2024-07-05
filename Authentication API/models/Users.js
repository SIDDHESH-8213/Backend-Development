const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    passwordHash: {type: String, required: true} 
})

userSchema.pre('save', async function (next){
    const user = this;
    if(!user.isModified('passwordHash')) return next();

    const saltRounds = 10;
    try{
        const hash = await bcrypt.hash(user.passwordHash, saltRounds);
        user.passwordHash = hash;
        next();
    }
    catch(err){
        return next(err);
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;