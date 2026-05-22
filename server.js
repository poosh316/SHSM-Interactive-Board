//imports
const express = require('express'); //express is the way that we are getting adn using user requests
const app = express(); //the app is to hold an express object
const path = require('path'); //importing the path npm module to make sure that directories work for all OS
const { logEvent, debugLog, actionLog, errorLog } = require(path.join(__dirname, 'middleware', 'logEvents.js')); // functions from the middleware of log events for back end debuging and information
const PORT = process.env.PORT || 3500; //sets the port as 3500
const mysql = require('mysql2');
const { worker } = require('cluster');
const pool = require(path.join(__dirname, 'middleware', 'makeDataBase.js'));

const session = require('express-session');
require('dotenv').config(); 


// console.log(con.query("SELECT * FROM mytable"));
//this section is just here for loging and debuging and stays at the top to be sure that it runs every time and logs what happened when a request comes in
app.use((req, res, next) => {
    // console.log("\"" + req.path + "\" to: " + "actionLog");
    if (/^\/info/.test(req.path) == false) {
        actionLog(req.path);
    } else {
        logEvent(req.path, "requestLog");
    }
    // console.log(JSON.stringify(req.body));
    next();//go to the next middleware function
});


//session setup goes before routes
app.use(session({
  secret: 'process.env.SESSION_SECRET',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 600000, //10 minutes in milliseconds
    httpOnly: true,  
    sameSite: 'lax'   
} 
}));


app.use(express.json());

app.use("/", require('./routes/root'));//relocates the user to the link relating to the url if it is a valid link

app.use("/int", require('./routes/interactSubdir'));


//make files in folder public accessible 
app.use('/', express.static(path.join(__dirname, '/public')));

// app.use('/', express.static(path.join(__dirname, '/build')));  //comment this out and move styles.css under stylesheet to the public folder to edit the styles.css without having to run npm run cssnano all the time


//check if user has extra access
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

app.post("/info", async (req, res) => {
    try {
        console.log(req.body);
        if (req.body.type == 'lights') {
            if(req.body.red >= 0 && req.body.red <= 255 &&
                req.body.green >= 0 && req.body.green <= 255 &&
                req.body.blue >= 0 && req.body.blue <= 255){
            await doQuery(`update lights set lightValue = ${req.body.red} where lightColor = "red"`)
            await doQuery(`update lights set lightValue = ${req.body.green} where lightColor = "green"`)
            await doQuery(`update lights set lightValue = ${req.body.blue} where lightColor = "blue"`)
            await doQuery('SELECT * FROM lights').then(results => {
                console.log(results);
                const sqlLogMes = `updated lights: ` +
                    `${results[0][Object.keys(results[0])[1]]}:${results[0][Object.keys(results[0])[2]]} ` +
                    `${results[1][Object.keys(results[1])[1]]}:${results[1][Object.keys(results[1])[2]]}`   +
                    `${results[2][Object.keys(results[2])[1]]}:${results[2][Object.keys(results[2])[2]]} `
                logEvent(sqlLogMes, "/dataBase");
            })
            }else{
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
                        },10000)
                    }
                }
            })
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
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await doQuery('UPDATE drone SET droneOn= 0 WHERE ID = 1').then(async () => await console.log("db prepared"))
});


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
