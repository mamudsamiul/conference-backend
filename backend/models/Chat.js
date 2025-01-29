const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    conferenceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conference', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chat', chatSchema);
