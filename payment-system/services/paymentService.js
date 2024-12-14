const amqp = require('amqplib');
const { transferPaymentToNotificationQueue } = require('../utils/rabbitmq');
require('dotenv').config();


const sendToPaymentQueue = async (paymentData) => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        const channel = await connection.createChannel();

        const queue = 'PaymentQueue';
        await channel.assertQueue(queue, { durable: true });

        channel.sendToQueue(queue, Buffer.from(JSON.stringify(paymentData)), {
            persistent: true,
        });

        console.log('Payment data sent to queue');

        await transferPaymentToNotificationQueue();

        await channel.close();
        await connection.close();
    } catch (error) {
        console.error('Error sending payment to RabbitMQ:', error);
        throw error;
    }
};

module.exports = { sendToPaymentQueue };
