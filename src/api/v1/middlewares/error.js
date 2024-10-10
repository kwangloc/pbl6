const logger = require('./logger');

// This function will catch errors occur on the Request Processing Pipeline (express)

module.exports = function (err, req, res, next) {
    // Log the exception
    // logger.error('An error occurred', err);
    // Send response
    res.status(500).json({
        status: 'error',
        message: 'Sorry! An error occurred!',
        details: err.message
    });
}