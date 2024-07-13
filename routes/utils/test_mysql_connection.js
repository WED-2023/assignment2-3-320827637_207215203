const mysql = require('mysql');
require('dotenv').config();

console.log("Starting MySQL connection test...");

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '11111111',
  database: 'mydb',
});

console.log("Attempting to connect to MySQL...");

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
  connection.end();
});
