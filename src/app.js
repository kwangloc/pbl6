const logger = require('./api/v1/middlewares/logger');
require('./api/v1/startup/logging.js')(logger); // Logging
const express = require('express');
const app = express();

require('./api/v1/startup/config.js')(); // Config
require('./api/v1/startup/routes.js')(app); // Add routes handlers
require('./api/v1/startup/db.js')(); // Connect to DB

// Environment
console.log(`app: ${app.get('env')}`); // dev env by default

// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Listening on port', port));