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

// temporary delete link
router.get(/^\/del(\/)?(.html)?$/, (req, res) => {
    const token = req.cookies.int_token; //

    if (token) {
        res.clearCookie('int_token', { //
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        });
        console.log("session deleted");
        res.redirect("/");
    } else {
        res.redirect('error.html');
    }
});

module.exports = router;
