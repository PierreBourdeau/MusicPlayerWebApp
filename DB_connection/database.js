var mysql = require('mysql');
var conn = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'audiolibdb',
    }
);

conn.connect((err) => {
    if (err) throw err;
    console.log('DB Successfuly connected');
});




module.exports = { conn };