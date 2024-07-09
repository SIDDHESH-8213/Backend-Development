const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    symbol: {type: String, required: true},
    name: {type: String, required: true},
    shares: {type: Number, required: true},
})

const Stock = mongoose.model('Stock', stockSchema);
module.exports = Stock;