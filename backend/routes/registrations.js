const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const auth = require('../middleware/auth');

// Get all registrations for a specific user
router.get('/:userId', auth, async (req, res) => {
    try {
        const registrations = await Registration.find({ userId: req.params.userId });
        res.json(registrations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
