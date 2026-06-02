const express = require('express');
const router = express.Router();
const path = require('path');

//temporary file and file path to be serverd
router.get(/^\/$|^\/drone(\/)?$|^\/drone(.ejs)?$/, (req, res) => {
    const token = req.cookies.guest_token;

    let isAuthenticated = false;
        
    if (token) {
        // Decode base64 JWT payload
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(Buffer.from(base64, 'base64').toString('utf8'));

        // Send time remaining in seconds to EJS template
        const currentTime = Math.floor(Date.now() / 1000);
        const secondsRemaining = payload.exp - currentTime;

        isAuthenticated = true;

        res.render(path.join(__dirname, "..", "views", "interactPages", "drone.ejs"), { secondsRemaining, isAuthenticated });
    } else {
        isAuthenticated = false;
        // res.redirect('error.html');
        res.render(path.join(__dirname, "..", "views", "interactPages", "drone.ejs"), { secondsRemaining: 0, isAuthenticated });
    }
});

router.get(/^\/lights(\/)?(.ejs)?$/, (req, res) => {
    const token = req.cookies.guest_token;

    let isAuthenticated = false;
        
    if (token) {
        // Decode base64 JWT payload
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(Buffer.from(base64, 'base64').toString('utf8'));
        
        // Send time remaining in seconds to EJS template
        const currentTime = Math.floor(Date.now() / 1000);
        const secondsRemaining = payload.exp - currentTime;

        isAuthenticated = true;

        res.render(path.join(__dirname, "..", "views", "interactPages", "lights.ejs"), { secondsRemaining, isAuthenticated });
    } else {
        isAuthenticated = false;
        // res.redirect('error.html');
        res.render(path.join(__dirname, "..", "views", "interactPages", "lights.ejs"), { secondsRemaining: 0, isAuthenticated });
    }
});

module.exports = router;