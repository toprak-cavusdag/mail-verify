const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../model/User.js');
const crypto = require('crypto');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

// E-posta onayı için token gönderme fonksiyonu
const sendVerificationEmail = async (user, token) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const verificationUrl = `${process.env.BASE_URL}/verify-email/${token}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'E-posta Onayı',
        html: `<p>Lütfen e-posta adresinizi onaylamak için <a href="${verificationUrl}">buraya tıklayın</a>.</p>`,
    };

    await transporter.sendMail(mailOptions);
};

// Kayıt olma
router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).send('Email already in use.');

        const newUser = new User({ email, password });

        // Onay token'ı oluştur
        const verificationToken = crypto.randomBytes(20).toString('hex');
        newUser.verificationToken = verificationToken;

        await newUser.save();

        // E-posta onayı gönder
        await sendVerificationEmail(newUser, verificationToken);

        res.status(201).send('User registered successfully, please verify your email.');
    } catch (err) {
      console.log(err)
    }
});

// E-posta onayı
router.post('/verify-email/:token', async (req, res) => {
    
    const { token } = req.params;

    try {
        const user = await User.findOne({ verificationToken: token });
        if (!user) return res.status(400).send('Invalid token.');

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        res.redirect(`${process.env.BASE_URL}/login`);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Giriş yapma
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).send('User not found.');
        if (!user.isVerified) return res.status(400).send('Email not verified.');

        const match = await user.comparePassword(password);
        if (!match) return res.status(400).send('Invalid credentials.');

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
