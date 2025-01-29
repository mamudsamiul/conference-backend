const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Session = require('../models/Session');
const Conference = require('../models/Conference');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { check, validationResult } = require('express-validator');

// @route    POST api/sessions
// @desc     Create a session
// @access   Private
router.post(
    '/',
    [
        auth,
        [
            check('name', 'Name is required').not().isEmpty(),
            check('startDateTime', 'Start date time is required').not().isEmpty(),
            check('endDateTime', 'End date time is required').not().isEmpty(),
            check('location', 'Location is required').not().isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, startDateTime, endDateTime, location } = req.body;

        try {
            const newSession = new Session({
                name,
                startDateTime,
                endDateTime,
                location
            });

            const session = await newSession.save();

            res.json(session);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

// @route    GET api/sessions
// @desc     Get all sessions
// @access   Private
router.get('/', auth, async (req, res) => {
    try {
        const sessions = await Session.find().populate('conferences');
        res.json(sessions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;


// Add a conference to a session
router.post('/:sessionId/conferences', auth, admin, async (req, res) => {
    const { sessionId } = req.params;
    const { title, description, date, time, presenterEmail, roomNumber } = req.body;

    try {
        const newConference = new Conference({
            title,
            description,
            date,
            time,
            presenterEmail,
            roomNumber,
            sessionId
        });

        const conference = await newConference.save();

        await Session.findByIdAndUpdate(sessionId, { $push: { conferences: conference._id } });

        res.json(conference);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
