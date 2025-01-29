const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    type: { type: String, required: true },
    details: { type: String, required: true }
});

module.exports = mongoose.model('Report', reportSchema);
