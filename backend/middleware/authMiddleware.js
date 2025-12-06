// backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

// Middleware function that runs before the final route handler
module.exports = function (req, res, next) {
    // Get token from header (usually sent as 'x-auth-token')
    const token = req.header('x-auth-token');

    // Check if not token
    if (!token) {
        // HTTP 401: Unauthorized
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    try {
        // Use the JWT_SECRET to decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Add the user payload (which contains the user ID) to the request object
        req.user = decoded.user;
        next(); // Move on to the next middleware or the route handler
    } catch (e) {
        // If token is invalid (expired, wrong signature, etc.)
        res.status(401).json({ msg: 'Token is not valid' });
    }
};