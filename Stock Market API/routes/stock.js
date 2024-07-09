const express = require('express');
const axios = require('axios');
const authMiddleware = require('../authMiddleware');
const router = express.Router();

router.get('/get-price/:symbol', async (req, res) => {
  const stockSymbol = req.params.symbol;
  try {
    const response = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stockSymbol}&apikey= FYAQMI163N2ORKE2`);
    console.log(response);
    const timeseries = response.data['Time Series (Daily)'];
    if(!timeseries) {
      console.error(`Error in fetching the stock price`, error);
      res.status(400).json({message: `Failed to get stock price`});
    }
    const recentDate = Object.keys(timeseries)[0];
    const recentClosingPrice = timeseries[recentDate]['4. close'];
    res.json({ symbol: stockSymbol, price: recentClosingPrice });
  } catch (error) {
    console.error('Error fetching stock price:', error);
    res.status(500).json({ message: 'Failed to fetch stock price' });
  }
});

module.exports = router;
