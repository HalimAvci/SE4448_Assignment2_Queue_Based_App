const amqp = require('amqplib');

const RABBITMQ_URI = process.env.RABBITMQ_URI || 'amqp://localhost';

async function connectRabbitMQ() {
    try {
        const connection = await amqp.connect(RABBITMQ_URI);
        const channel = await connection.createChannel();
        return channel;
    } catch (error) {
        console.error('RabbitMQ bağlantısı başarısız:', error);
        throw error;
    }
}

async function transferPaymentToNotificationQueue() {
    const channel = await connectRabbitMQ();

    const paymentQueue = 'PaymentQueue';
    const notificationQueue = 'NotificationQueue';

    await channel.assertQueue(paymentQueue, { durable: true });
    await channel.assertQueue(notificationQueue, { durable: true });

    channel.consume(paymentQueue, async (msg) => {
        if (msg) {
            console.log('PaymentQueue\'dan alınan mesaj:', msg.content.toString());

            await channel.sendToQueue(notificationQueue, Buffer.from(msg.content));
            
            channel.ack(msg);
        }
    });
}

module.exports = { transferPaymentToNotificationQueue };
