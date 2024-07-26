const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    title:{type: String, required: true},
    content: {type:String, required: true},
    owner:{type: mongoose.Schema.Types.ObjectId, reg: 'User', required: true},
    collaborators: [{type: mongoose.Schema.Types.ObjectId, ref:'User'}],
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}, 
});

const Document = mongoose.model('Document', documentSchema);
module.exports = Document;