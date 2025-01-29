const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    presenter: { type: String, required: true },
    conference: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, default: 'Pending' } // 'Pending', 'Approved', 'Declined'
});

module.exports = mongoose.model('Payment', paymentSchema);
