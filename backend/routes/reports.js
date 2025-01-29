const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const User = require('../models/User');
const Conference = require('../models/Conference');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Get all registration details along with user and conference information
router.get('/registrations', [auth, admin], async (req, res) => {
    try {
        const registrations = await Registration.find()
            .populate('userId', 'username email age department phoneNo address')
            .populate('conferenceId', 'title description date presenterEmail');
        res.json(registrations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get all registration details along with user and conference information for a specific conference
router.get('/registrations/:conferenceId', [auth, admin], async (req, res) => {
    try {
        const registrations = await Registration.find({ conferenceId: req.params.conferenceId })
            .populate('userId', 'username email age department phoneNo address')
            .populate('conferenceId', 'title description date presenterEmail');
        res.json(registrations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
