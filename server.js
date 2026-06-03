//imports
const express = require('express'); //express is the way that we are getting adn using user requests
const app = express(); //the app is to hold an express object
const path = require('path'); //importing the path npm module to make sure that directories work for all OS
const { logEvent, debugLog, actionLog, errorLog } = require(path.join(__dirname, 'middleware', 'logEvents.js')); // functions from the middleware of log events for back end debuging and information
const PORT = process.env.PORT || 3500; //sets the port as 3500
const mysql = require('mysql2');
const { worker } = require('cluster');
const pool = require(path.join(__dirname, 'middleware', 'makeDataBase.js'));
const spamTime = 300;
require('dotenv').config();

const cookieParser = require('cookie-parser');
app.set('view engine', 'ejs');

const crypto = require('crypto');
const timer = 300000;  //10 minutes in milliseconds

var current = 1234;
var prev = 1234;



var userIps = [];

const piIp = "10.191.28.102";

var piUsername = "razPi";
var piPassword = "43%SureThisIsPassword";

app.enable('trust proxy');
// console.log(con.query("SELECT * FROM mytable"));
//this section is just here for loging and debuging and stays at the top to be sure that it runs every time and logs what happened when a request comes in
app.use((req, res, next) => {
    // console.log(req.ip);

    // console.log("\"" + req.path + "\" to: " + "actionLog");
    console.log("\"" + req.path + "\" to: " + "actionLog");
    if (/^\/info/.test(req.path) == false) {
        actionLog(req.path);
    } else {
        logEvent(req.path, "requestLog");
    }
    // console.log(JSON.stringify(req.body));
    next();//go to the next middleware function
});


app.use(express.json());

app.use(cookieParser(process.env.SIGNING_SECRET));

app.use("/", require('./routes/root'));//relocates the user to the link relating to the url if it is a valid link

app.use("/int", require('./routes/interactSubdir'));


//make files in folder public accessible 
app.use('/', express.static(path.join(__dirname, '/public')));

// app.use('/', express.static(path.join(__dirname, '/build')));  //comment this out and move styles.css under stylesheet to the public folder to edit the styles.css without having to run npm run cssnano all the time


//check if user has extra access
app.use("/cookies", (req, res, next) => {
    app.set("currentNum", current);
    app.set("prevNum", prev);
    next();
})
app.use("/cookies", require('./routes/cookies'));


//an exception case if the link is wrong it will send a 404 error

app.get(/^\/info/, async (req, res) => {
    if (req.url.split('/').length - 2 == 3) {
        const data = req.url.split("/");
        await doQuery(`SELECT ${data[3]} from ${data[2]} where id = ${data[4]}`).then(results => {
            // console.log(results);
            res.json(results);
        })
    } else if (req.url.split('/').length - 2 == 2) {
        const data = req.url.split("/");
        await doQuery(`SELECT ${data[3]} from ${data[2]}`).then(results => {
            // console.log(results);
            res.json(results);
        })
    }
    // res.sendStatus(204);
});

app.get(/^\/code/, async (req, res, next) => {
    if (!req.header["piname"] || !req.header["pikey"]) {
        logEvent(`someone with ip: ${req.ip} just used /code without ${!req.header["piname"] && !req.header["pikey"] ? "username and password" : !req.header["pikey"] ? "password" : "username"}`, "codeWarning");
        next();
    } else {
        if (req.header["piname"] == piUsername && req.header["pikey"] == piPassword) {
            if (req.ip != piIp) {
                logEvent(`someone with ip: ${req.ip} just sussesfuly signed into code with the wrong ip`, "codeWarning");
            }
            res.json({ QR: currentCode });
        } else {
            logEvent(`someone with ip: ${req.ip} just used /code without correct ${req.header["piname"] != piUsername && !req.header["pikey"] != piPassword ? `username:${req.header["piname"]} and password:${"pikey"}` : req.header["pikey"] != piPassword ? `password:${req.header["pikey"]}` : `username:${req.header["piname"]}`}`, "codeWarning");
            res.statusCode(401).send("nope");
        }
    }
});

app.post("/info", async (req, res) => {
    try {
        if (req.cookies.int_token) {
            token = req.cookies.int_token;
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(Buffer.from(base64, 'base64').toString('utf8'));
            // console.log(payload.code);
            if (payload.code == current || payload.code == prev) {
                console.log("good");
                console.log(payload.code);
                if (userIps.indexOf(req.ip) == -1) {
                    console.log(req.ip);
                    userIps.push(req.ip);
                    console.log(req.body);
                    if (req.body.type == 'lights') {
                        if (req.body.red >= 0 && req.body.red <= 255 &&
                            req.body.green >= 0 && req.body.green <= 255 &&
                            req.body.blue >= 0 && req.body.blue <= 255) {
                            await doQuery(`update lights set lightValue = ${req.body.red} where lightColor = "red"`)
                            await doQuery(`update lights set lightValue = ${req.body.green} where lightColor = "green"`)
                            await doQuery(`update lights set lightValue = ${req.body.blue} where lightColor = "blue"`)
                            await doQuery('SELECT * FROM lights').then(results => {
                                console.log(results);
                                const sqlLogMes = `updated lights: ` +
                                    `${results[0][Object.keys(results[0])[1]]}:${results[0][Object.keys(results[0])[2]]} ` +
                                    `${results[1][Object.keys(results[1])[1]]}:${results[1][Object.keys(results[1])[2]]}` +
                                    `${results[2][Object.keys(results[2])[1]]}:${results[2][Object.keys(results[2])[2]]} `
                                logEvent(sqlLogMes, "/dataBase");
                            })
                        } else {
                            errorLog("the user put in a bad request as: " + req.body);
                        }
                    } else if (req.body.type == 'drone') {
                        await doQuery('SELECT DroneOn FROM drone').then(async (val) => {
                            if (val[0][Object.keys(val[0])[0]] != req.body.droneOn) {
                                console.log("working");
                                await doQuery(`UPDATE drone SET DroneOn = ${req.body.droneOn} where id = 1`)
                                await doQuery('SELECT * FROM drone').then(results => {
                                    const sqlLogMes = `updated drone` +
                                        `drone ` + `${results[0][Object.keys(results[0])[0]]}: ` + `${results[0][Object.keys(results[0])[1]]}`
                                    logEvent(sqlLogMes, "/dataBase")

                                })
                                if (req.body.droneOn == 1) {
                                    setTimeout(async () => {
                                        console.log("stopping")
                                        await doQuery(`UPDATE drone SET droneOn = 0 where id = 1`)
                                        await doQuery('SELECT * FROM drone').then(results => {
                                            const sqlLogMes = `updated drone` +
                                                `drone ` + `${results[0][Object.keys(results[0])[0]]}: ` + `${results[0][Object.keys(results[0])[1]]}`
                                            logEvent(sqlLogMes, "/dataBase");

                                        })
                                    }, 5000)
                                }
                            }
                        })
                    }
                    setTimeout(async () => {
                        console.log("removing ip: " + userIps[0]);
                        userIps.shift();
                    }, spamTime);
                } else {
                    console.log(userIps);
                    console.log("your ip of " + req.ip + "has done a reqest already");
                }
            }else{
                logEvent()
                console.log("WRONG CODE");
                console.log(payload.code);
            }
        }else{
            console.log("no code");
        }
    } catch (err) {
        console.log(err);
        errorLog(err);
        // res.sendStatus(404);
    }

    res.sendStatus(204);
});

app.get(/.*/, (req, res) => {
    res.status(404).sendFile('./views/error.html', { root: __dirname }); // send the 404.html file to the client if the requested page is not found
});


//starts listening on the port
app.listen(PORT, '0.0.0.0', async () => {
    console.log(`Server running on port ${PORT}`);
    updateCode();
    updateCode();
    await doQuery('UPDATE drone SET droneOn= 0 WHERE ID = 1').then(async () => await console.log("db prepared"))
});

// error handling/logging
const doQuery = async (sql) => {
    return new Promise((resolve, reject) => {
        try {
            const data = pool.query(sql, async (err, results, fields) => {
                if (err) {
                    await console.log("there was an error");
                    // console.log(err);
                    await errorLog(String(err));
                    resolve(err);
                }
                // console.log(results);
                resolve(results);
            });
            // console.log();
        } catch (err) {
            // throw err;
            console.log(err);
            errorLog(err);
        }
    })
}

// generates a very long random string
setInterval( async () => {
    updateCode();
}, timer);

const updateCode = async () =>{
    prev = current;
    current = crypto.randomUUID();
    console.log("newCode: " + current);
}