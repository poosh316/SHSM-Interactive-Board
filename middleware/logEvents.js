//imports
//date and uuid are not used yet but will be good for better logs
const { format } = require("date");
const {v4: uuid } = require('uuid');
const fs = require('fs');//lets us write and read files
const path = require('path');//mostly for path.join

//logs something with the message and where it needs to go without the need for .txt
const logEvent = async (message, dest) => {
    //makes sure the destination is a string
    const destination = String(dest);
    try{
        //if the log folder does not exist it makes it
        if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
            fs.mkdirSync(path.join(__dirname, "..", "logs"));
        }
        //if the destination does not exist it makes the file for it
        if (!fs.existsSync(path.join(__dirname, "..", "logs", destination) + ".txt")){
            fs.writeFileSync(path.join(__dirname, "..", "logs", destination) + ".txt", "");
        }
        //writes the message to the file
        fs.appendFileSync(path.join(__dirname, "..", "logs", destination)+ ".txt", message + "\n");
        //writes the message to the console
        // console.log("\"" + message + "\" to: " + destination);
    }catch (err){
        //catches any errors with file makeing
        console.log(err);
    }
}
//this is the general logging for every event
const actionLog = async (newPath) => {
    logEvent(newPath, '/actionLog');
}
//debuging log for developers specificly
const debugLog = async (msg) => {
    logEvent(msg, 'debug');
}
//log for whenever there is an error
const errorLog = async (err) => {
    logEvent(msg, 'error');
}
//exports the functions so that servr.js can access it
module.exports = {logEvent, debugLog, actionLog}