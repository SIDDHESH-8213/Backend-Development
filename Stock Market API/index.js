const express = require("express");
const mongoose = require("mongoose")
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 3000;

const authRoutes = require('./routes/auth');
const portfolioRoutes = require('./routes/portfolio');
const stockRoutes = require('./routes/stock');
const newsRoutes = require('./routes/news');


app.use(express.json());

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/stockmarket', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, `MongoDb Connection Error:`))
db.once('open', ()=>{
    console.log("Connected to MongoDb")
})

app.use('/auth', authRoutes);
app.use('/portfolio', portfolioRoutes);
app.use('/stock', stockRoutes);
app.use('/news', newsRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
