var mysql = require('mysql');
require("dotenv").config();
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const config = {
  host: process.env.host, // "localhost"
  user: process.env.user, // "root"
  password: process.env.password,
  database: process.env.database,
};

console.log(process.env.host)
console.log(process.env.user)
console.log(process.env.password)
console.log(process.env.database)

const pool = mysql.createPool(config);

const connection = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) reject(err);
      console.log("MySQL pool connected: threadId " + connection.threadId);
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