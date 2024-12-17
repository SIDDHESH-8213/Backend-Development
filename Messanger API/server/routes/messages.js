const express = require("express")
const router = express.Router();
const Message = require('../models/Message.js')

function generateConversationId(userId1, userId2) {
    const sortedIds = [userId1, userId2].sort();
    return `${sortedIds[0]}-${sortedIds[1]}`;
}

router.post("/", async(req, res)=>{
    const {sender, receiver, content} = req.body;
    try{
        const conversationId = generateConversationId(sender, receiver);
        const newMessage = new Message({
            sender, 
            receiver,
            content,
            conversationId,
        })
        await newMessage.save();
        res.status(201).json({message: "Message sent successfully"});
    }
    catch(err){
        return res.status(500).json({error: err.message});
    }
});

router.get('/:conversationId', async(req, res)=>{
    const {conversation} = req.params;
    try{
        const message = await Message.find({conversation})
            .sort({timestamp: 1})
            .populate("sender", "username")
            .populate("receiver", "username");
        if(!message) return res.status(404).json({message: "No such conversation"});
        res.status(201).json({data : message});
    }
    catch(error){
        res.status(500).json({error: error.message});
    }
});