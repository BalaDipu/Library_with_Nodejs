const appError = require("../utils/appError");

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}:${err.value}`;
    return new appError(message, 400);
}

const handleDuplicateFieldsDB = err => {
    const value = err.message.match(/\{(.*?)\}/)[0];
    const message = `Duplicate field value:${value}. Please use another value`;
    return new appError(message, 400);
}

const handleValidationErrorDB = err => {
    const errors = Objects.values(err.errors).map(el => {
        el.message
    })
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new appError(message, 400);
}

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })
}

const sendErrorProd = (err, res) => {
    // Operational error, trusted error:send message to the client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    } else {
        // Programming error, unknown error: don't send error message
        //    logging error for developer
        console.log('Error', err);

        //  send to the client generic message
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong'
        })
    }
}


module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500,
        err.status = err.status || 'error'

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        err.message = err.message;
        if (err.name === 'CastError') err = handleCastErrorDB(err);
        if (err.code === 11000) err = handleDuplicateFieldsDB(err);
        if (err.name === 'ValidationError') err = handleValidationErrorDB(err);
        sendErrorProd(err, res);
    }
}