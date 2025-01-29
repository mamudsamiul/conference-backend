const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SessionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    startDateTime: {
        type: Date,
        required: true
    },
    endDateTime: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    conferences: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Conference'
        }
    ]
});

module.exports = mongoose.model('Session', SessionSchema);
