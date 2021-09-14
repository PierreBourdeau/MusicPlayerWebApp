var database = require('../DB_connection/database');

function uploadSongs(datas) {
    var sql = 'INSERT INTO audios (filename) VALUES ?';
    database.conn.query(sql, [datas], (err, res) => {
        if (err) throw err;
        else {
            console.log('Music added successfully');
        }
    });
}

function getFormatedDatas(array) {
    var res = [];
    for (let i = 0; i < array.length; i++) {
        res.push([array[i].originalname]);
    }
    return res;
}

module.exports = { uploadSongs, getFormatedDatas };