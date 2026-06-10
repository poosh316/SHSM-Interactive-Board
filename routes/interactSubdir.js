const express = require('express');
const router = express.Router();
const path = require('path');
const sendTime = require(path.join(__dirname, "..", "middleware", "sendTime.js"));

//temporary file and file path to be server
router.get(/^\/$|^\/drone(\/)?$|^\/drone(.ejs)?$/, async (req, res) => {
    res.render(path.join(__dirname, "..", "views", "interactPages", "drone.ejs"), await sendTime.timeExpiry(req,res));
});

router.get(/^\/lights(\/)?(.ejs)?$/, async (req, res) => {
    // console.log("thing: " + (await sendTime.timeExpiry(req.cookies.int_token))["secondsRemaining"]);
    res.render(path.join(__dirname, "..", "views", "interactPages", "lights.ejs"), await sendTime.timeExpiry(req,res));
});

module.exports = router;
