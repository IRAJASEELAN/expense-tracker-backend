const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // 1. Grab the token from the header
    const token = req.header('x-auth-token');

    // 2. If no token is provided, deny access
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // 3. Verify the token using your secret key
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach the user ID to the request
        next(); // Let them pass!
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};