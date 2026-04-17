const express = require('express');
const router = express.Router();
const path = require('path');

//temporary file and file path to be serverd
router.get(/^\/$|^\/drone(\/)?$|^\/drone(.html)?$/, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "views", "interactPages", "drone.html"));
});

router.get(/^\/lights(\/)?(.html)?$/, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "views", "interactPages", "lights.html"));
});
module.exports = router;