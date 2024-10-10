module.exports = function(logger) {
    // sync errors
    process.on('uncaughtException', (err) => {
        console.log('We got an uncaughtException!');
        logger.error(err);
        process.exit(1);
    })
    // async errors
    process.on('unhandledRejection', (err) => {
        console.log('We got an unhandledRejection!');
        logger.error(err);
        process.exit(1);
    })
}