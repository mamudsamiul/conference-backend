const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    conferenceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conference', required: true },
    ticket: { type: String, required: true },
    attended: { type: Boolean, default: false },
    chatEnabled: { type: Boolean, default: false }
});

module.exports = mongoose.model('Registration', registrationSchema);
