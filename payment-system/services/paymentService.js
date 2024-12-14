const { getChannel } = require('../utils/rabbitmq');

const QUEUE_NAME = 'PaymentQueue';

const sendPayment = async (paymentPayload) => {
    const channel = getChannel();
    channel.assertQueue(QUEUE_NAME, { durable: true });
    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(paymentPayload)));
    console.log('Payment sent to queue:', paymentPayload);
};

const start = async () => {
    console.log('Payment Service is running...');
};

module.exports = { sendPayment, start };
