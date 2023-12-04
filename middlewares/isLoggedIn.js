const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/User');

const isLoggedIn = catchAsync(async (req, res, next) => {
    // Getting token and check of it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
        token = req.headers.authorization.split(' ')[1];
    if (!token) 
        return next(new AppError('You are not logged in! Please log in to access', 401));

    // Verification token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user)
        return next(new AppError('The token belonging to user does not exist', 401));

    // Check token was issued before password changed
    if (user.changedPasswordAfter(decoded.iat))
        return next(new AppError('User has changed the password recently! Please log in again', 401));

    req.user = user;
    next();
});

module.exports = isLoggedIn;