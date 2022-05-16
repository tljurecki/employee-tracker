//import dependencies
const mysql= require('mysql2');


//conect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: process.env.DB_PASSWORD,
        database: 'emploee_db'
    }
);

module.exports = db;