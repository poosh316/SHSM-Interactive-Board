const mysql = require('mysql2');

const pool = mysql.createPool({
    host: "10.191.164.55",
    user: "UnpaidIndieDev",
    password: "TheUnpaid123",
    database: "boardStatus",
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = pool;