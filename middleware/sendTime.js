const express = require('express');
const router = express.Router();
const path = require('path');
//this is to validate and respond with time left for a cookie
const timeExpiry = async (req,res) => {
    let isAuthenticated = false;
    let secondsRemaining = 0;
    try{
        //get token
        token = req.cookies.int_token
        //if token exists
        if (token) {
            // Decode base64 JWT payload
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(Buffer.from(base64, 'base64').toString('utf8'));
            //if payload.code equals currentNum or prevNum
            if(payload.code == req.app.currentNum||payload.code == req.app.prevNum){
                // get time remaining in seconds for sending to ejs files
                const currentTime = Math.floor(Date.now() / 1000);
                secondsRemaining = payload.exp - currentTime;
                isAuthenticated = true;
            }else{
                //delete the cookie
                res.clearCookie('int_token', { 
                    path: "/",
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict'
                });
            }
        } else {
            isAuthenticated = false;
            secondsRemaining = 0;
        }
    }catch(err){
        if(req.app.debug >= 2)
        console.log(err);
    }
    //send isAuthenticated and secondsRemaining in a JSON
        // interactSubdir.js will then send it to the ejs files
    return {isAuthenticated, secondsRemaining};
}

module.exports = { timeExpiry };