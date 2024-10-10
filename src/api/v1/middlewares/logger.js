const winston = require('winston');
require('winston-mongodb');
const { MongoClient } = require('mongodb');
const mongoUrl = 'mongodb://localhost:27017/user_service';

// Create a Winston logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
        // Console transport for development
        new winston.transports.Console({ format: winston.format.simple() }),
        // Write all logs with importance level of `error` or less to `error.log`
        new winston.transports.File({ filename: './logs/error.log', level: 'error' }),
        // Write all logs with importance level of `info` or less to `combined.log`
        new winston.transports.File({ filename: './logs/combined.log' }),

        // MongoDB transport
        new winston.transports.MongoDB({
            db: mongoUrl,
            options: { useUnifiedTopology: true },
            collection: 'logs',
            level: 'info',
            capped: true, // Enable capped collection
            cappedSize: 10000000, // 10MB size limit
            cappedMax: 5000, // Maximum number of documents
            tryReconnect: true,
            metaKey: 'meta'
        })
    ],
});

//
// Ensure MongoDB connection
async function ensureConnection() {
    try {
        //   const client = new MongoClient(mongoUrl, { useUnifiedTopology: true });
        const client = new MongoClient(mongoUrl);
        await client.connect();
        console.log('Connected to MongoDB');
        client.close();
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1);
    }
}

// Ensure MongoDB connection before starting your app
// ensureConnection();

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `

// if (process.env.NODE_ENV !== 'production') {
//   logger.add(new winston.transports.Console({
//     format: winston.format.simple(),
//   }));
// }

module.exports = logger;