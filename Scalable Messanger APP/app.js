require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const {connectRedis} = require('./config/redis')
const {connectKafka} = require('./config/kafka')
const chatRoutes = require('./routes/chat');
const authRoutes = require('./routes/auth');
const http = require('http');
const socketHandler = require('./sockets');
const logger = require('./utils/logger');
const cors = require('cors')
const runKafkaConsumer = require('./consumers/kafkaConsumer'); 
const runNotificationConsumer = require('./consumers/notificationConsumer');

const app = express();
const port = process.env.PORT || 5000;

connectDB();

app.use(cors())
app.use(express.json());

app.use('/api/chat', chatRoutes);
app.use('/api/auth', authRoutes);

async function startServer(){
    try{
        await connectRedis()
        await connectKafka()
        const server = http.createServer(app)
        socketHandler(server)
        server.listen(port, () => logger.info(`Server running on port ${port}`));
    }catch(error){
        console.log(error)
    }
}

startServer()