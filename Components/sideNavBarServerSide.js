var database = require('../DB_connection/database');

function updatePP(user, datas, cb) {
    var sql = `UPDATE user_db SET user_pp = '${datas}' WHERE user_email = '${user}'`;
    database.conn.query(sql, (err, res) => {
        if (err) throw err;
        else {
            console.log('Profile Picture changed successfully');
            cb(datas);
        }
    });
}


module.exports = { updatePP };
