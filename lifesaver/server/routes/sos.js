const express = require('express');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const SOS = require('../models/SOS');
const Contact = require('../models/Contact');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

// Trigger SOS
router.post('/trigger', auth, async (req, res) => {
  try {
    const { latitude, longitude, message } = req.body;
    const user = await User.findById(req.userId);
    const contacts = await Contact.find({ user: req.userId });

    if (contacts.length === 0)
      return res.status(400).json({ message: 'No emergency contacts found. Please add contacts first.' });

    const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
    const alertMessage = `EMERGENCY ALERT from ${user.name}!\n${message || 'I need help!'}\nMy location: ${mapsLink}`;

    const notified = [];

    for (const contact of contacts) {
      // Send SMS
      try {
        await twilioClient.messages.create({
          body: alertMessage,
          from: process.env.TWILIO_PHONE,
          to: contact.phone,
        });
        notified.push(contact.phone);
      } catch (e) {
        console.log('SMS failed for', contact.phone, e.message);
      }

      // Send Email
      if (contact.email) {
        try {
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: contact.email,
            subject: `EMERGENCY ALERT from ${user.name}`,
            text: alertMessage,
            html: `<h2 style="color:red">EMERGENCY ALERT</h2>
                   <p><strong>${user.name}</strong> needs help!</p>
                   <p>${message || 'I need help!'}</p>
                   <a href="${mapsLink}" style="background:red;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">View Location on Map</a>`,
          });
          notified.push(contact.email);
        } catch (e) {
          console.log('Email failed for', contact.email, e.message);
        }
      }
    }

    const sos = await SOS.create({ user: req.userId, latitude, longitude, message, notifiedContacts: notified });
    res.status(201).json({ message: 'SOS alerts sent!', sos, notified });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get SOS history
router.get('/history', auth, async (req, res) => {
  try {
    const history = await SOS.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Resolve SOS
router.put('/resolve/:id', auth, async (req, res) => {
  try {
    const sos = await SOS.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { status: 'resolved' },
      { new: true }
    );
    res.json(sos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
