const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb+srv://pipo1995popo:yJbowkqs6WUnIJEs@cluster0.16h2t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/conference', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Routes
const authRoutes = require('./routes/auth');
const conferenceRoutes = require('./routes/conferences');
const userRoutes = require('./routes/users');
const paymentRoutes = require('./routes/payments');
const reportRoutes = require('./routes/reports');
const registrationRoutes = require('./routes/registrations');
const sessionRoutes = require('./routes/sessions');
app.use('/api/auth', authRoutes);
app.use('/api/conferences', conferenceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/sessions', sessionRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
