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

module.exports = router;