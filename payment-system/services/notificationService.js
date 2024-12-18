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
        text: `Hello,\n\nYour payment of type "${emailData.paymentType}" was successful.\n\nThank you!`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`\u2705 Email successfully sent to: ${emailData.user}`);
    } catch (error) {
        console.error(`\u274C Error sending email to ${emailData.user}:`, error);
        throw error;
    }
};

const processPaymentQueue = async () => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        const channel = await connection.createChannel();
        const paymentQueue = 'PaymentQueue';
        const notificationQueue = 'NotificationQueue';

        await channel.assertQueue(paymentQueue, { durable: true });
        await channel.assertQueue(notificationQueue, { durable: true });

        console.log(`Listening for messages in queue: "${paymentQueue}"`);

        channel.consume(paymentQueue, async (msg) => {
            const paymentData = JSON.parse(msg.content.toString());

            const maskedCardNo = paymentData.cardNo.replace(/^(\d{4})\d+(\d{4})$/, '$1********$2');
            const updatedPaymentData = { ...paymentData, cardNo: maskedCardNo };

            console.log(`Received payment data:\n   User: ${updatedPaymentData.user}\n   Payment Type: ${updatedPaymentData.paymentType}\n   Card No: ${updatedPaymentData.cardNo}`);

            try {
                await sendNotificationEmail(updatedPaymentData);

                const notificationMessage = {
                    user: updatedPaymentData.user,
                    message: 'Your payment has been received successfully.',
                };

                channel.sendToQueue(notificationQueue, Buffer.from(JSON.stringify(notificationMessage)), {
                    persistent: true,
                });

                console.log(`Notification added to queue: "${notificationQueue}" for user: ${updatedPaymentData.user}`);

                channel.ack(msg);
            } catch (error) {
                console.error(`\u274C Failed to process payment data for user: ${updatedPaymentData.user}`);
            }
        });
    } catch (error) {
        console.error('\u274C Error processing payment queue:', error);
    }
};

processPaymentQueue();
