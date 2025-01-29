const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Get all payments
router.get('/', [auth, admin], async (req, res) => {
    try {
        const payments = await Payment.find();
        res.json(payments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Approve payment
router.post('/approve/:id', [auth, admin], async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        payment.status = 'Approved';
        await payment.save();
        res.json(payment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Decline payment
router.post('/decline/:id', [auth, admin], async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        payment.status = 'Declined';
        await payment.save();
        res.json(payment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
