var mysql = require('mysql2'); //mysql -> mysql2
require("dotenv").config();
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const config = {
  host: "localhost", // "localhost"
  user: "root", // "root"
  password: "11111111",
  database: "mydb",
};

console.log(config.host);
console.log(config.user);
console.log(config.password);
console.log(config.database);

const pool = mysql.createPool(config);

const connection = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Error connecting to MySQL:", err);
        reject(err);
        // return;
      }
      if (connection) {
        console.log("MySQL pool connected: threadId " + connection.threadId);
      }
      const query = (sql, binding) => {
        return new Promise((resolve, reject) => {
          connection.query(sql, binding, (err, result) => {
            if (err) reject(err);
            resolve(result);
          });
        });
      };
      const release = () => {
        return new Promise((resolve, reject) => {
          if (!connection) {
            reject(new Error("Connection is undefined"));
            return;
          }
          console.log("MySQL pool released: threadId " + connection.threadId);
          resolve(connection.release());
        });
      };
      resolve({ query, release });
    });
  });
};

const query = (sql, binding) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, binding, (err, result, fields) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

module.exports = { connection, query };