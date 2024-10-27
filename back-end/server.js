const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()

const app = express();
app.use(bodyParser.json());
app.use(cors());

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

app.post('/send-email', (req, res) => {
    const { name, email, phone, people, message } = req.body;

    const mailOptions = {
        from: email,
        to: process.env.EMAIL,
        subject: 'miHuelva',
        text: `Nombre: ${name}\nEmail: ${email}\nTeléfono: ${phone}\nNumero de personas: ${people}\nMensaje: ${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(error.toString());
        }
        res.status(200).send('Email sent successfully');
    });
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
