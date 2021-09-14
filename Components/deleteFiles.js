var database = require('../DB_connection/database');

function deleteSong(datas) {
    var sql = `DELETE FROM audios WHERE filename = '${ datas }'`;
    database.conn.query(sql, datas, (err, res) => {
        if (err) throw err;
        else {
            console.log('Song deleted');
        }
    });
}

module.exports = { deleteSong };