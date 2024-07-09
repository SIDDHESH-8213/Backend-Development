const express = require('express');
const axios = require('axios');
const authMiddleware = require('../authMiddleware');
const router = express.Router();

router.get('/latest', async (req, res) => {
  try {
    const response = await axios.get('https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=AAPL&apikey=FYAQMI163N2ORKE2');
    const news = response.data['feed'].slice(0,5);
    const newslist = news.map(item =>({
        title : item.title,
        URL : item.url,
    }))
    res.json(newslist);
  } catch (error) {
    console.error('Error fetching market news:', error);
    res.status(500).json({ message: 'Failed to fetch market news' });
  }
});

module.exports = router;
