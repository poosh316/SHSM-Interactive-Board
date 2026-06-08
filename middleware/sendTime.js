const express = require('express');
const router = express.Router();
const path = require('path');

const timeExpiry = async (token) => {
    console.log(`sendTime.js`);
    let isAuthenticated = false;
    let secondsRemaining = 0;
        
    if (token) {
        // Decode base64 JWT payload
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(Buffer.from(base64, 'base64').toString('utf8'));
        
        // Send time remaining in seconds to EJS template
        const currentTime = Math.floor(Date.now() / 1000);
        secondsRemaining = payload.exp - currentTime;

        isAuthenticated = true;
    } else {
        isAuthenticated = false;
        secondsRemaining = 0;
    }
    // var isA = isAuthenticated;
    return {isAuthenticated, secondsRemaining};
}

module.exports = { timeExpiry };