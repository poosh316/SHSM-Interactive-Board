//imports
const express = require('express');
const router = express.Router();
const path = require('path');

//temporary file and file path to be serverd
router.get(/^\/$|^\/home(\/)?(.html)?$/, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "views", "home.html"));
});

//about file
router.get(/^\/about(\/)?(.html)?$/, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "views", "about.html"));
});

//signup file
router.get(/^\/signup(\/)?(.html)?$/, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "views", "signup.html"));
});


//this should be deleted later
//403.ejs  
router.get(/^\/403(\/)?(.ejs)?$/, (req, res) => {
    const token = req.cookies.guest_token;
    
    if (token) {
        // Decode base64 JWT payload
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(Buffer.from(base64, 'base64').toString('utf8'));
        
        // Send time remaining in seconds to EJS template
        const currentTime = Math.floor(Date.now() / 1000);
        const secondsRemaining = payload.exp - currentTime;

        res.render(path.join(__dirname, "..", "views", "403.ejs"), { secondsRemaining });
    } else {
        res.redirect('error.html');
    }
});




module.exports = router;