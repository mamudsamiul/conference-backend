const mongoose = require('mongoose');

const ConferenceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    presenterEmail: {
        type: String,
        required: true
    },
    roomNumber: {
        type: String,
        required: false
    },
    enabled: {
        type: Boolean,
        default: false
    },
    chatEnabled: {
        type: Boolean,
        default: false
    },
    paymentStatus: {
        type: String,
        enum: ['None', 'Pending', 'Approved'],
        default: 'None'
    },
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Session',
        required: true
    },
    chairId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Conference', ConferenceSchema);
