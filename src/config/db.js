require('dotenv').config(path = "../.env");

const mysql = require('mysql2')

const connection = mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_ROOT_PASSWORD,
        database: process.env.MYSQL_DATABASE
    });

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Server!');
});

module.exports = connection