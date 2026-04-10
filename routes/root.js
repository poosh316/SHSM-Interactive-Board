//imports
const express = require('express');
const router = express.Router();
const path = require('path');

//temporary file and file path to be serverd
router.get(/^\/$|^\/temp$/, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "views", "temp.html"));
});

module.exports = router;