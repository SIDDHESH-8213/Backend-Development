const mongoose = require("mongoose")

const MessageSchema = new mongoose.Schema({
  sender: {type: mongoose.Schema.Type.ObjectId, ref: "User", required: true},
  receiver: {type: mongoose.Schema.Type.ObjectId, ref: "User", required: true},
  content: {type: String, required: true},
  timestamp: {type: Date, default : Date.now},
  conversationId : {type: String, required: true},
});

module.exports = mongoose.model('Message', MessageSchema);