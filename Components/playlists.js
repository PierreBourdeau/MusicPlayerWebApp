var database = require('../DB_connection/database');


function createPlaylist(userId, playlistName, cb) {
    sql1 = `SELECT * from playlists WHERE playlist_name = '${playlistName}' AND user_id = '${userId}'`;
    database.conn.query(sql1, (err, rows) => {
        if (err) throw err;
        else {
            if (rows.length == 0) {
                sql = `INSERT INTO playlists (user_id, playlist_name) VALUES ('${userId}','${playlistName}')`;
                database.conn.query(sql, (err, rows) => {
                    if (err) throw err;
                    else {
                        console.log(`Playlist ${playlistName} created successfully`);
                    }
                })
            }
            else {
                console.log('Playlist already created');
            }
            cb();
        }
    })
}

function getUserAllPlaylists(userId, cb) {
    sql = `SELECT * from playlists WHERE user_id = ?`;
    var playlists = [];
    database.conn.query(sql, userId, (err, rows) => {
        if (err) throw err;
        else {
            for (let i = 0; i < rows.length; i++) {
                playlists.push(rows[i]);
            }
            cb(playlists);
        }
    })
}

function changeFavoriteStatus(songId) {
    var sql = `UPDATE AUDIOS SET favorite = NOT favorite WHERE id = '${songId}'`;
    database.conn.query(sql, (err, rows) => {
        if (err) throw err;
    })
}



function addToPlaylist(playlistId, songId) {
    var sql1 = `SELECT * FROM playlists_songs WHERE playlist_id = ${playlistId} AND song_id = ${songId}`;
    database.conn.query(sql1, (err, rows) => {
        if (err) throw err;
        else {
            if (rows.length == 0) {
                var sql = `INSERT INTO playlists_songs (playlist_id,song_id) VALUES (${playlistId},${songId}) `;
                database.conn.query(sql, (err, rows2) => {
                    if (err) throw err;
                    else {
                        console.log('Song added to playlist');
                    }
                })
            }
            else {
                console.log('The song is already in the playlist');
            }
        }
    })
}

module.exports = { createPlaylist, getUserAllPlaylists, changeFavoriteStatus, addToPlaylist };