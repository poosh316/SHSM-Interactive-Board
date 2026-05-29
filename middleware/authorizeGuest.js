const jwt = require('jsonwebtoken');

const authenticateGuest = (req, res, next) => {
    console.log('Authenticating guest session...');
    const token = req.cookies.guest_token;

    if (!token) {
        return res.status(401).json({ message: 'No session found, please authenticate' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SESSION_SECRET);
        req.user = decoded; // Attach user/guest data to the request
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            console.log('Guest token expired:', error);
            // Clear the expired cookie from the browser
            res.clearCookie('guest_token');
            return res.status(401).json({ message: 'Guest session has expired' });
        }
        console.log('Invalid guest token:', error);
        return res.status(401).json({ message: 'Invalid token' });
    }
};
