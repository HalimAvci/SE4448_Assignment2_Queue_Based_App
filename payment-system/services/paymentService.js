const amqp = require('amqplib');
const { transferPaymentToNotificationQueue } = require('../utils/rabbitmq');
require('dotenv').config();

const sendToPaymentQueue = async (paymentData) => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        const channel = await connection.createChannel();

        const queue = 'PaymentQueue';
        await channel.assertQueue(queue, { durable: true });

        const maskedCardNo = paymentData.cardNo.replace(/^(\d{4})\d+(\d{4})$/, '$1********$2');

        const maskedPaymentData = {
            ...paymentData,
            cardNo: maskedCardNo,
        };

        console.log(`\u2705 Payment data sent to queue {\n   User: ${maskedPaymentData.user}\n   Payment Type: ${maskedPaymentData.paymentType}\n   Card No: ${maskedPaymentData.cardNo}\n }`);

        channel.sendToQueue(queue, Buffer.from(JSON.stringify(maskedPaymentData)), {
            persistent: true,
        });

        await transferPaymentToNotificationQueue();

        await channel.close();
        await connection.close();
    } catch (error) {
        console.error('\u274C Error sending payment to RabbitMQ:', error);
        throw error;
    }
};

module.exports = { sendToPaymentQueue };
