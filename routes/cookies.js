// routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const path = require('path');

router.get('', (req, res) => {
    // 1. Create unique identity for this anonymous session
    //temporary guest authentication (stateless, anonymous)
    const guestPayload = {
        isGuest: true,
        guestId: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        permissions: {canWrite: true}
    };

    // 2. Sign the JWT with a 10-minute expiration
    const token = jwt.sign(guestPayload, process.env.SESSION_SECRET, { expiresIn: '10m' });

    // 3. Bake the token into an HTTP-only cookie
    res.cookie('guest_token', token, {   //always the same token
        httpOnly: true,       // Secures the cookie from frontend script access
        secure: process.env.NODE_ENV === 'production', // true in production, false in local dev
        sameSite: 'strict',   // CSRF mitigation
        maxAge: 10 * 60 * 1000 // Force browser auto-drop after exactly 10 minutes
    });

    // 4. Return success state back to the frontend trigger
    console.log('Guest session started (routes/cookies.js)');
    res.redirect("/");
});

module.exports = router; 





