const logger = require('../middlewares/logger');
const mongoose = require('mongoose');
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/user_service';

module.exports = function() {
    mongoose.connect(mongoUri)
        .then(() => logger.info('Connected to MongoDB...'))
}


// mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch(err => console.error('Could not connect to MongoDB', err));