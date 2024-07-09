const express = require("express");
const authMiddleware = require("../authMiddleware");
const Stock = require("../models/Stock");
const router = express.Router();

router.post("/add-stock", authMiddleware, async (req, res) =>{
    const {symbol, name, shares} = req.body;

    try{
        const stock = new Stock({userId: req.userId, symbol, name, shares});
        await stock.save();
        res.status(201).json({message: `Stock added to portfolio`});
    }
    catch(error){
        console.error('Error in adding stock:', error);
        res.status(501).json({message: 'Failed to add stock'});
    }
});

router.delete("/remove-stock/:id", authMiddleware, async (req, res) =>{
    const stockid = req.params.id;
    try{
        await Stock.findByIdAndDelete(stockid);
        res.status(200).json({message: `Stock removed from portfolio`});
    }
    catch(error){
        console.error(`Failed to delete stock`, error);
        res.status(501).json({message: `failed to remove stock`});
    }
});

router.get("/get-portfolio", authMiddleware, async(req, res) =>{
    try{
        const stocks = await Stock.find({userId: req.userId});
        res.status(201).json(stocks);
    }
    catch(error){
        console.error('failed to get portfolio', error);
        res.status(500).json({message: `failed to get portfolio`});
    }
});

module.exports = router;