const fs = require('fs');
const uploader = require('./uploadFiles');
var database = require('../DB_connection/database');

function syncAllFolder() {
    fs.readdir('./uploads', (err, files) => {
        if (err) throw err;
        else {
            files.forEach(async file => {
                var sql = `SELECT * from audios WHERE filename = ?`;
                database.conn.query(sql, file,  async (err, res) => {
                    if (err) throw err;
                    else {
                        if (res.length  == 0) {
                            await uploader.uploadSongs([[`${file}`]]);
                        }
                    }
                });
                /*const result = await fetch('/syncAll', {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({ title: file }),
                });
                if (result.ok) {
                    console.log('Fetch success');
                    const resp = await result.json();
                    if (resp.success) {
                        console.log('fetch to json success');
                    }
                    if (!resp.success) {
                        console.log('error in json translation');
                    }
                }*/
            })
        }
    })
}

syncAllFolder();

module.exports = { syncAllFolder };