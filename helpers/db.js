var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'sql12.freemysqlhosting.net',
    user     : 'sql12238801',
    password : 'Nm9xpwDGae',
    database : 'sql12238801'
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;