const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const {genAccessToken, genRefreshToken} = require('../utils/jwt');
const sendMail = require('../utils/sendMail');

const createSendToken = async (user, statusCode, res) => {
    // Generate Access Token
    const accessToken = genAccessToken({id: user._id});

    // Generate refresh token and store it in db
    await RefreshToken.findOneAndDelete({user: user.id});
    const refreshTokenDoc = await RefreshToken.create({user: user.id});
    const refreshToken = genRefreshToken({ user: refreshTokenDoc.user, tokenId: refreshTokenDoc.id });

    // Store refreshToken in cookie
    res.cookie('refreshToken', refreshToken, {httpOnly: true, maxAge: process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000});

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        data: {
            user,
            accessToken,
            refreshToken
        }
    });
}

exports.signup = catchAsync(async (req, res, next) => {
    const user = await User.findOne({email: req.body.email});

    if (user) return next(new AppError('Email already existed', 400));

    const newUser = await User.create({
        email: req.body.email,
        fullname: req.body.fullname,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    createSendToken(newUser, 200, res);
});

exports.login = catchAsync(async (req, res, next) => {
    const {email, password} = req.body;
    // Check if email and password exist
    if (!email || !password) return next(new AppError('Please provide email or password', 400));

    // Check email and password
    let user = await User.findOne({email});
    if (!user || !user.correctPassword(password))
        return next(new AppError('Incorrect email or password', 401));

    createSendToken(user, 200, res);
});

exports.logout = catchAsync(async (req, res, next) => {
    res.clearCookie('refreshToken');
    return res.status(200).json({
        status: 'success'
    });
});

exports.validateRefreshToken = catchAsync(async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return next(new AppError('Missing Refresh Token', 401));
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    // Find refresh token stored in db
    const tokenExists = RefreshToken.findById(decoded.tokenId);
    if (!tokenExists) return next(new AppError('Refresh Token is invalid', 401));
    req.refreshToken = decoded;
    next();
});

exports.refreshAccessToken = catchAsync(async (req, res, next) => {
    const refreshToken = req.refreshToken;
    // Restore new refresh token
    const refreshTokenDoc = await RefreshToken.create({user: refreshToken.user});
    await RefreshToken.deleteOne({_id: refreshToken.tokenId});
    // Generate new refresh token and new access token
    const newRefreshToken = genRefreshToken({user: refreshTokenDoc.user, tokenId: refreshTokenDoc.id});
    const newAccessToken = genAccessToken({id: refreshToken.user});

    res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true, 
        maxAge: process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
        status: 'success',
        data: {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        }
    });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
    // Get user from collection
    const user = await User.findById(req.user.id).select('+password');
  
    // Check if POSTed current password is correct
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
      return next(new AppError('Your current password is wrong.', 401));
    }
  
    // If so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    // User.findByIdAndUpdate will NOT work as intended!
  
    // Log user in, send JWT
    createSendToken(user, 200, req, res);
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
    // Get user based on Posted email
    const user = await User.findOne({email: req.body.email});
    if (!user) return next(new AppError('There is no user with email address', 404));

    const resetToken = user.createPasswordResetToken();
    await user.save({validateBeforeSave: false});

    // URL for reset password
    const url = `${req.protocol}://${req.headers.host}/api/users/reset-password/${resetToken}`;
    const text = 
    `You forgot the password? Access to the link and reset your password:
    ${url}`;
    try {
        await sendMail({
            to: user.email,
            subject: 'Forgot password? Your password reset token is valid for only 10 minutes',
            text
        });
        return res.status(200).json({
            status: 'success',
            message: 'Token sent to email'
        });
    } catch (error) {
        console.log(error);
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({validateBeforeSave: false});
        return next(new AppError('There was an error sending the email', 500));
    }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    // Hash password reset token and find user
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: {$gt: Date.now()}
    });

    if (!user) return next(new AppError('Token is invalid or has expired', 400));
    
    // update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({validateBeforeSave: true});

    createSendToken(user, 200, res);
});
