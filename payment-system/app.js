require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { connectRabbitMQ } = require('./utils/rabbitmq');
const paymentService = require('./services/paymentService');
const notificationService = require('./services/notificationService');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// RabbitMQ'yu başlat
connectRabbitMQ().then(() => {
    paymentService.start();
    notificationService.start();
});

// API Endpoint: Ödeme Gönder
app.post('/payment', async (req, res) => {
    const { user, paymentType, cardNo } = req.body;

    if (!user || !paymentType || !cardNo) {
        return res.status(400).send({ message: 'All fields are required' });
    }

    await paymentService.sendPayment({ user, paymentType, cardNo });
    res.send({ message: 'Payment has been sent to the queue' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
