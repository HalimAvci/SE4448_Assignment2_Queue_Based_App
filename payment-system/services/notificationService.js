const amqp = require('amqplib');
const nodemailer = require('nodemailer');
require('dotenv').config();

const sendNotificationEmail = async (emailData) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: emailData.user,
        subject: 'Payment Successful',
        text: `Hello, your payment of type ${emailData.paymentType} was successful.`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent to', emailData.user);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};


const processPaymentQueue = async () => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        const channel = await connection.createChannel();
        const queue = 'PaymentQueue';

        await channel.assertQueue(queue, { durable: true });

        channel.consume(queue, async (msg) => {
            const paymentData = JSON.parse(msg.content.toString());
            console.log('Received payment data:', paymentData);

            await sendNotificationEmail(paymentData);

            channel.ack(msg);
        });
    } catch (error) {
        console.error('Error processing payment queue:', error);
    }
};

processPaymentQueue();
