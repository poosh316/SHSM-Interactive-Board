const mysql = require('mysql2');
//sets up the mysql database connection be sure to be using local host, the name of the user, the passwortd for the user and the database with proper capitilization
const pool = mysql.createPool({
    host: "localhost",
    user: "UnpaidIndieDev",
    password: "TheUnpaid123",
    database: "boardStatus",
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = pool;