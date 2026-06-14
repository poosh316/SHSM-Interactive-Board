// routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const path = require('path');

// /.*/ is regex for anything any character. This means this will run for any path with /c/# where # is any value(s)
router.get(/.*/, (req, res, next) => {
    //checks if the digits after /c/ are equal to the current number or previous number set in server.js
    if (req.url.slice(1) == req.app.get("currentNum") || req.url.slice(1) == req.app.get("prevNum")) {
        //create unique identity for this session
        const intPayload = {
            code: ((req.url.slice(1) == req.app.get("currentNum")) ? req.app.get("currentNum") : req.app.get("prevNum"))
        };

        // create JWT (JSON web token) with a 10-minute expiration
        const token = jwt.sign(intPayload, process.env.SESSION_SECRET, { expiresIn: '10m' });

        // make the token into an HTTP-only cookie
        res.cookie('int_token', token, {   
            httpOnly: true,       
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'strict',   
        });

        // return success and send to lights page
        res.status(200).send(
            `<script>
                setTimeout(() => {
                    window.location.href = "/int/lights"
                },10)
            </script>`
        );
    } else {
        res.redirect("/");
    }
});

module.exports = router;





