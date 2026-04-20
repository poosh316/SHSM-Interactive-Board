//imports
const express = require('express'); //express is the way that we are getting adn using user requests
const app = express(); //the app is to hold an express object
const path = require('path'); //importing the path npm module to make sure that directories work for all OS
const {logEvent, debugLog, actionLog} = require(path.join(__dirname, 'middleware', 'logEvents.js')); // functions from the middleware of log events for back end debuging and information
const PORT = process.env.PORT || 3500; //sets the port as 3500


//this section is just here for loging and debuging and stays at the top to be sure that it runs every time and logs what happened when a request comes in
app.use((req, res, next) => {
    console.log("\"" + req.path + "\" to: " + "actionLog");
    actionLog(req.path);
    next();//go to the next middleware function
});

app.use(express.static('public')); //make files in folder public accessible 
// //it does make the actual pages in the public folder accessible by typing them in so that needs to be changed

app.use("/", require('./routes/root'));//relocates the user to the link relating to the url if it is a valid link

app.use("/int", require('./routes/interactSubdir') )
//an exception case if the link is wrong it will send a 404 error
app.get(/.*/, (req, res) => {
    res.status(404).sendFile('./views/error.html', { root: __dirname }); // send the 404.html file to the client if the requested page is not found
});




//starts listening on the port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
