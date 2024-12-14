const express = require('express');
const { sendToPaymentQueue } = require('./services/paymentService');

const app = express();
app.use(express.json());

app.post('/payment', async (req, res) => {
    const paymentData = req.body;

    try {
        await sendToPaymentQueue(paymentData);
        res.status(200).send('Payment request sent to queue');
    } catch (error) {
        res.status(500).send('Failed to process payment');
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
