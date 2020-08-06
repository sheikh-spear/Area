const mysql = require('mysql');

const connection = mysql.createConnection({
    host: "mysql",
    user: "admin",
    password: "nimad",
    database: "users"
});

connection.connect();
module.exports = connection;
