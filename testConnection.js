const { connection } = require('./routes/utils/MySql');

console.log("Starting connection test...");

connection()
  .then(conn => {
    console.log("Connection successful");
    return conn.release();
  })
  .catch(err => {
    console.error("Connection failed", err);
  });

console.log("Test script executed.");