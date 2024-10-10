function admin(req, res, next) {
    // if (!req.user.isAdmin) return res.status(403).send('Access denied! You do not have permisson to access this resource!.');
    if (!req.body.isAdmin) return res.status(403).send('Access denied! You do not have permisson to access this resource!.');

    next(); // next to the route handler
} 

module.exports = admin;