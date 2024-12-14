const nodemailer = require('nodemailer');
const { getChannel } = require('../utils/rabbitmq');

const PAYMENT_QUEUE = 'PaymentQueue';
const NOTIFICATION_QUEUE = 'NotificationQueue';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // .env'deki adres
        pass: process.env.EMAIL_PASS, // .env'deki şifre
    },
});

const start = async () => {
    const channel = getChannel();
    channel.assertQueue(PAYMENT_QUEUE, { durable: true });
    channel.consume(PAYMENT_QUEUE, async (msg) => {
        const payment = JSON.parse(msg.content.toString());
        console.log('Processing payment:', payment);

        // Bildirim kuyruğuna gönder
        channel.assertQueue(NOTIFICATION_QUEUE, { durable: true });
        channel.sendToQueue(NOTIFICATION_QUEUE, Buffer.from(JSON.stringify(payment)));

        // Ödemeyi tamamla
        channel.ack(msg);

        // E-posta gönder
        await sendNotification(payment);
    });
};

const sendNotification = async (payment) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: payment.user,
        subject: 'Payment Received',
        text: `Your payment of type ${payment.paymentType} has been processed.`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent to:', payment.user);
    } catch (error) {
        console.error('Email Error:', error);
    }
};

module.exports = { start };
