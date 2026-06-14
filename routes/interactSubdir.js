const express = require('express');
const router = express.Router();
const path = require('path');
const sendTime = require(path.join(__dirname, "..", "middleware", "sendTime.js"));

//drone page
router.get(/^\/$|^\/drone(\/)?$|^\/drone(.ejs)?$/, async (req, res) => {
    res.render(path.join(__dirname, "..", "views", "interactPages", "drone.ejs"), await sendTime.timeExpiry(req,res));
});

//lights page
router.get(/^\/lights(\/)?(.ejs)?$/, async (req, res) => {
    res.render(path.join(__dirname, "..", "views", "interactPages", "lights.ejs"), await sendTime.timeExpiry(req,res));
});

module.exports = router;
