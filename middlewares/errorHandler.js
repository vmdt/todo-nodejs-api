const AppError = require('../utils/appError');

const sendErrorDev = (err, res) => {
    return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack
    });
}

const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    } else {
        return res.status(err.statusCode).json({
            status: 'error',
            message: 'Something went wrong!'
        })
    }
}

const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV.trim() === 'production') {
        sendErrorProd(err, res);
    } else {
        sendErrorDev(err, res);
    }
}

module.exports = globalErrorHandler;
