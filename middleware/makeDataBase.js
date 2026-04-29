const mysql = require('mysql2');

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "unpaid",
    database: "boardstatus",
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = pool;