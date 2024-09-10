require('dotenv').config()
const express = require('express');
const path = require('path')
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = 5000; // You can use any port

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));


app.set('view engine', 'ejs')
app.set('views', path.resolve('./views'))

// Route for handling get requests
app.get('/', (req, res) => {
    return res.render('index');
})

// Route for handling form submissions
app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;

    // Validate the incoming data
    if (!name || !email || !message) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    // Configure the email transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail', // You can use other services like Outlook, Yahoo, etc.
        auth: {
            user: ADMIN_EMAIL, // Replace with your email
            pass: ADMIN_PASSWORD   // Replace with your email password or app password
        }
    });

    // Configure the email options
    const mailOptions = {
        from: email,
        to: 'rk4759728@gmail.com', // Replace with the email where you want to receive the messages
        subject: `Contact Form Submission from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ message: 'An error occurred while sending the email.' });
        }
        res.status(200).json({ message: 'Your message has been sent successfully!' });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
