// routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const path = require('path');

// /.*/ is regex for anything any character. This means this will run for any path with /c/# where # is any value(s)
router.get(/.*/, (req, res, next) => {
    // 1. Create unique identity for this anonymous session
    //temporary guest authentication (stateless, anonymous)
    //checks if the digits after /c/ are equal to the current number or previous number set in server.js
    if (req.url.slice(1) == req.app.get("currentNum") || req.url.slice(1) == req.app.get("prevNum")) {
        const intPayload = {
            intId: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            code: ((req.url.slice(1) == req.app.get("currentNum")) ? req.app.get("currentNum") : req.app.get("prevNum"))
        };

        // 2. Sign the JWT with a 10-minute expiration
        const token = jwt.sign(intPayload, process.env.SESSION_SECRET, { expiresIn: '10m' });

        // make the token into an HTTP-only cookie
        res.cookie('int_token', token, {   
            httpOnly: true,       
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'strict',   
            maxAge: 10 * 60 * 1000 // Force browser auto-drop after exactly 10 minutes
        });

        // 4. Return success state back to the frontend trigger
        console.log('Guest session started (routes/cookies.js)');
        res.status(200).send(
            `<script>
                setTimeout(() => {
                    window.location.href = "/int/lights"
                },10)
            </script>`
        );
        // res.status(200).json({ 
        //     success: true, 
        //     message: 'Int session started successfully' 
        // });
    } else {
        res.redirect("/");
    }
});

module.exports = router;





