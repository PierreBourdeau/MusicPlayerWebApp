var database = require('../DB_connection/database');
var bcrypt = require('bcrypt');

function register(datas, callback) {
    var sql1 = 'SELECT * FROM user_db WHERE user_email = ? ';
    database.conn.query(sql1, datas.usermail, async (err, rows) => {
        if (err) throw err;
        else {
            if (rows.length == 0) {
                const hash = await bcrypt.hash(datas.userpassword, 10);
                var sql2 = `INSERT INTO user_db (user_email,user_password,user_name,user_surname,user_pp) VALUES ('${datas.usermail}', '${hash}', '${datas.username}', '${datas.usersurname}', '${datas.userProfilePicture}')`;
                database.conn.query(sql2, (err, res) => {
                    if (err) throw err;
                    else {
                        console.log('User added successfully');
                        return callback(true);
                    }
                });
            }
            else {
                console.log(` User : ${datas.usermail} already registered !`);
                return callback(false);
            }
        }
    });
}


module.exports = { register };