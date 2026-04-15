const express = require('express');
const router = express.Router();
const path = require('path');

//temporary file and file path to be serverd
router.get(/^\/$|^\/interact(\/)?$|^\/interact(.html)?$/, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "views", "interactPages", "interact.html"));
});

router.get(/^\/lights(\/)?(.html)?$/, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "views", "interactPages", "lights.html"));
});

module.exports = router;