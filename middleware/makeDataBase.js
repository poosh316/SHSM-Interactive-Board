const mysql = require('mysql2');

const pool = mysql.createPool({
    host: "10.191.161.221",
    user: "UnpaidIndieDev",
    password: "theUnpaid123",
    database: "boardstatus",
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = pool;