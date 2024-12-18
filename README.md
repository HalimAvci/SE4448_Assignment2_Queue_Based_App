# Presentation Link

https://www.youtube.com/watch?v=GOH4e0VsFJ0

Note: The audio recording is missing due to issues with finding a suitable microphone.

# Payment System with RabbitMQ

This project demonstrates a simple payment processing system using **RabbitMQ** and **Email Notifications.** The payment data is sent to a **PaymentQueue**, and once processed, a notification email is sent to the user confirming the successful payment.

# Features

 - **Payment Processing Queue:** Payment data is sent to a RabbitMQ queue (PaymentQueue).
 - **Email Notifications:** After the payment is processed, a confirmation email is sent to the user via Gmail.
 - **REST API:** The project exposes a POST endpoint (/payment) for receiving payment requests.

# Technologies

 - **Node.js:** JavaScript runtime for building the backend server.
 - **Express.js:** Web framework for Node.js to create REST APIs.
 - **RabbitMQ:** Message broker for queuing payment data and processing it asynchronously.
 - **Nodemailer:** Library for sending emails using Gmail's SMTP service.
 - **dotenv:** Loads environment variables from a .env file to securely manage sensitive data (like email credentials and RabbitMQ URL).
 - **Postman:** Tool for testing REST APIs.
 - **WebStorm:** IDE used for developing this project.

# Install Dependencies

I ran the following command to install the necessary dependencies:
```bash
npm install express body-parser amqplib nodemailer dotenv
```

# Set up RabbitMQ
I used this command in RabbitMQ Command Prompt to enable the RabbitMQ management plugin (for web UI access):
```bash
rabbitmq-plugins enable rabbitmq_management
```
![Ekran görüntüsü 2024-12-14 224024](https://github.com/user-attachments/assets/9958dd01-e663-4bdd-9577-a888b1e9555a)
![Ekran görüntüsü 2024-12-14 224141](https://github.com/user-attachments/assets/704b2ff7-d309-4c77-97eb-0f12c709d909)

# Run the Application

To start the application, run:
```bash
node app.js
```
![Ekran görüntüsü 2024-12-14 223954](https://github.com/user-attachments/assets/3b9f12f8-93bd-4ddb-aa00-bc8392d0b96a)
![Ekran görüntüsü 2024-12-14 224359](https://github.com/user-attachments/assets/1c155aab-50e7-48bc-8431-2b157f68ed75)


# Test the Payment Endpoint

I tested the API using Postman sending a POST request to the following endpoint:

**POST** http://localhost:3000/payment

**Body (JSON):**
```bash
{
  "user": "user@example.com",
  "paymentType": "credit",
  "cardNo": "1234123412341234"
}
```

![Ekran görüntüsü 2024-12-14 224216](https://github.com/user-attachments/assets/11ed3583-ebbe-4661-aa8f-796cd284fc31)

