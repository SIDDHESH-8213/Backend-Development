const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const authMiddleware = require('./utils/authMiddleware');
const authRoutes = require('./routes/authRoutes.js');
const documentRoutes = require('./routes/documentRoutes');
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/docs',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes)

app.get('/', (req, res)=>{
    res.send('App running on port 5000')
})

module.exports = app;