const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const User = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        validate: [validator.isEmail, "Invalid email"]
    },
    fullname:{
        type: String,
        required: [true, "Fullname is required"],
    },
    avatar: {
        type: Object
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    }, 
    passwordConfirm: {
        type: String,
        required: [true, "Password confirm is required"],
        validate: {
            validator: function(v) {
                return this.password === v;
            },
            message: 'Password confirm is not match password'
        }
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    passwordChangedAt: Date,
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

User.pre('save', function(next) {
    // Only run when password was actually modified 
    if (!this.isModified('password')) return next();
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(this.password, salt);
    this.password = hash;
    this.passwordConfirm = undefined;
    next();
});

User.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

User.methods.correctPassword = function(candidatePassword) {
    return bcrypt.compareSync(candidatePassword, this.password);
}

User.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(10).toString('hex');

    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
}

User.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
        const convertTimestamp = Math.round(this.passwordChangedAt.getTime() / 1000);
        return convertTimestamp > JWTTimestamp;
    }
    return false;
}

module.exports = mongoose.model('User', User);
