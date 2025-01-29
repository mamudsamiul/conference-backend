const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number, required: true },
    department: { type: String, required: true },
    phoneNo: { type: String, required: true },
    address: { type: String, required: true },
    role: { type: String, required: true } // 'Attendee', 'Presenter', 'Chair', 'Admin'
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Check if the model is already compiled
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
