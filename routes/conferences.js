const express = require('express');
const router = express.Router();
const Conference = require('../models/Conference');
const Registration = require('../models/Registration');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const chair = require('../middleware/chair');
const Chat = require('../models/Chat'); // Ensure this line is present
const mongoose = require('mongoose'); // Ensure mongoose is imported

// Get all conferences
router.get('/', auth, async (req, res) => {
    try {
        const conferences = await Conference.find();
        res.json(conferences);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Create a new conference
router.post('/', [auth, admin], async (req, res) => {
    const { title, description, date, time,presenterEmail } = req.body;
    try {
        const conference = new Conference({ title, description, date, time,presenterEmail });
        await conference.save();
        res.json(conference);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Enable/Disable a conference
router.patch('/:id/enable', [auth, admin], async (req, res) => {
    try {
        const conference = await Conference.findById(req.params.id);
        conference.enabled = !conference.enabled;
        await conference.save();
        res.json(conference);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Register for a conference
router.post('/:id/register', auth, async (req, res) => {
    const { userId } = req.body;
    try {
        const registration = new Registration({
            userId,
            conferenceId: req.params.id,
            ticket: `TICKET-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            attended: false,
            chatEnabled: false
        });
        await registration.save();
        res.json(registration);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Attend a conference
router.post('/:id/attend', auth, async (req, res) => {
    const { userId } = req.body;
    try {
        const registration = await Registration.findOne({ userId, conferenceId: req.params.id });
        registration.attended = true;
        await registration.save();
        res.json(registration);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Enable/Disable chat room
router.patch('/:id/chat', [auth, chair], async (req, res) => {
    const { enabled } = req.body;
    try {
        const conference = await Conference.findById(req.params.id);
        conference.chatEnabled = enabled;
        await conference.save();
        res.json(conference);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// Assign a chair to a conference
router.patch('/:id/assign-chair', [auth, admin], async (req, res) => {
    const { chairId } = req.body;
    try {
        const conference = await Conference.findById(req.params.id);
        conference.chairId = chairId;
        await conference.save();
        res.json(conference);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const conference = await Conference.findById(req.params.id)
            .populate('chairId', 'username')
            .populate('presenterEmail');
        if (!conference) {
            return res.status(404).json({ msg: 'Conference not found' });
        }
        res.json(conference);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// Fetch all chats for a conference (dummy route for this example)
// router.get('/:id/chats', auth, async (req, res) => {
//     // Dummy implementation, replace with actual chat fetching logic
//     res.json([{ user: 'John Doe', message: 'Hello' }]);
// });

// Request payment approval
router.post('/:id/request-payment', auth, async (req, res) => {
    try {
        const conference = await Conference.findById(req.params.id);
        if (!conference) {
            return res.status(404).json({ msg: 'Conference not found' });
        }
        conference.paymentStatus = 'Pending';
        await conference.save();
        res.json(conference);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Approve or reject payment
router.patch('/:id/approve-payment', [auth, admin], async (req, res) => {
    const { status } = req.body;
    try {
        const conference = await Conference.findById(req.params.id);
        if (!conference) {
            return res.status(404).json({ msg: 'Conference not found' });
        }
        conference.paymentStatus = status;
        await conference.save();
        res.json(conference);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get all chats for a conference
router.get('/:conferenceId', auth, async (req, res) => {
    try {
        const chats = await Chat.find({ conferenceId: req.params.conferenceId }).sort({ timestamp: 1 });
        res.json(chats);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Send a chat message
router.post('/:conferenceId', auth, async (req, res) => {
    const { message } = req.body;
    try {
        const chat = new Chat({
            conferenceId: req.params.conferenceId,
            userId: req.user.id,
            username: req.user.username,
            message
        });
        await chat.save();
        res.json(chat);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Existing routes...

// Custom function to find chats by conferenceId
const findChatsByConferenceId = async (conferenceId) => {
    try {
        console.log('Searching chats for conferenceId:', conferenceId);
        const chats = await Chat.find({ conferenceId: new mongoose.Types.ObjectId(conferenceId) }).sort({ timestamp: 1 });
        console.log('Found chats:', chats);
        return chats;
    } catch (err) {
        console.error('Error finding chats:', err.message);
        throw new Error('Error finding chats');
    }
};

// Get all chats for a conference
router.get('/:conferenceId/chats', auth, async (req, res) => {
    try {
        console.log('Fetching chats for conference:', req.params.conferenceId);
        const chats = await findChatsByConferenceId(req.params.conferenceId);
        console.log('Fetched chats:', chats);
        res.json(chats);
    } catch (err) {
        console.error('Error fetching chats:', err.message);
        res.status(500).send('Server error');
    }
});

// Send a chat message
router.post('/:conferenceId/chats', auth, async (req, res) => {
    const { message } = req.body;
    try {
        console.log('Sending message:', { message }, req.params.conferenceId, req.user.id, req.user.username);
        if (!message) {
            return res.status(400).json({ msg: 'Message content is required' });
        }

        const chat = new Chat({
            conferenceId: new mongoose.Types.ObjectId(req.params.conferenceId),
            userId: req.user.id,
            username: req.user.username,
            message
        });
        await chat.save();
        console.log('Saved chat:', chat);
        res.json(chat);
    } catch (err) {
        console.error('Error sending message:', err.message);
        res.status(500).send('Server error');
    }
});

// Verify QR code ticket
router.get('/verify-ticket/:conferenceId', auth, async (req, res) => {
    const { conferenceId } = req.params;
    try {
        console.log('Verifying ticket for conference:', conferenceId);

        // Fetch conference by ID
        const conference = await Conference.findById(conferenceId);
        if (!conference) {
            return res.status(404).json({ msg: 'Conference not found' });
        }

        // Check if payment status is approved
        if (conference.paymentStatus === 'Approved') {
            res.json({ msg: 'Ticket is valid' });
        } else {
            res.status(400).json({ msg: 'Invalid ticket' });
        }
    } catch (err) {
        console.error('Error verifying ticket:', err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
