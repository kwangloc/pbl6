const express = require('express');

const users = require('../routes/userRoute');
// const auth = require('../routes/auth');
const error = require('../middlewares/error');

module.exports = function (app) {
    app.use(express.json()); // middleware
    // Built-in Modules (routes handlers)
    // app.use('/api/genres', genres);
    // app.use('/api/customers', customers);
    // app.use('/api/movies', movies);
    // app.use('/api/rentals', rentals);
    app.use('/api/users', users);
    // app.use('/api/auth', auth);
    // Error handler
    app.use(error);
}