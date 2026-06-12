const express = require('express');
const router = express.Router();
const path = require('path');


const timeExpiry = async (req,res) => {
    console.log(`sendTime.js`);
    let isAuthenticated = false;
    let secondsRemaining = 0;
    try{
    token = req.cookies.int_token
    if (token) {
        // Decode base64 JWT payload
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(Buffer.from(base64, 'base64').toString('utf8'));
        // if(payload.code == req.app.currentNum||payload == req.app.prevNum){
        // Send time remaining in seconds to EJS template
            const currentTime = Math.floor(Date.now() / 1000);
            secondsRemaining = payload.exp - currentTime;

            isAuthenticated = true;
        // }else{
        //     res.clearCookie('int_token', { //
        //         path: "/",
        //         httpOnly: true,
        //         secure: true,
        //         sameSite: 'strict'
        //     });
        // }
    } else {
        isAuthenticated = false;
        secondsRemaining = 0;
    }
    }catch(err){
        console.log(err);
    }
    // var isA = isAuthenticated;
    return {isAuthenticated, secondsRemaining};
}

module.exports = { timeExpiry };