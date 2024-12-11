const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  userName : {type: String, unique: true, required: true},
  password: {tpye: String, required: true},
})

module.exports = mongoose.Model("User", UserSchema);