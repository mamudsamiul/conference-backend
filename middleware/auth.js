const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function (req, res, next) {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        console.log('No auth header');
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        console.log('No token');
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, 'secret'); // Replace 'your_jwt_secret' with your secret
        req.user = decoded.user;

        const user = await User.findById(req.user.id);
        if (!user) {
            console.log('User not found');
            return res.status(401).json({ msg: 'User not found, authorization denied' });
        }

        req.user.username = user.username; // Add this line to ensure username is set
        req.user.role = user.role;
        next();
    } catch (err) {
        console.log('Token is not valid');
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
