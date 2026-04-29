const mysql = require('mysql2');

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "unpaid",
    database: "boardstatus",
    waitForConnections: true,
    connectionLimit: 10
});

pool.connect((err) => {
  if (err) {
    console.log("there was an error");
    throw err;
  }
  console.log("Connected!");
  
});

module.exports = pool;