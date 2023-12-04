const jwt = require('jsonwebtoken');

const genAccessToken = (data) => {
    return jwt.sign(data, process.env.JWT_SECRET, {expiresIn: process.env.ACCESS_EXPIRES_IN});
}

const genRefreshToken = (data) => {
    return jwt.sign(data, process.env.JWT_SECRET, {expiresIn: process.env.REFRESH_EXPIRES_IN});
}

module.exports = {
    genAccessToken,
    genRefreshToken
}