// database.js
var mysql = require('mysql2');

var connection = mysql.createConnection({
  host: "localhost", 
  user: "root",      
  password: "abdullah", 
  database: "up_skillo_db"  // Changed to your database
});

module.exports = connection;