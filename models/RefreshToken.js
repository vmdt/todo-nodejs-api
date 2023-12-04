const mongoose = require("mongoose");

const RefreshToken = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

RefreshToken.index(
  { createdAt: 1 },
  { expireAfterSeconds: process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 }
);
module.exports = mongoose.model("RefreshToken", RefreshToken);
