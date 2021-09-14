var database = require('../DB_connection/database');
const mm = require('music-metadata');
var fs = require('fs');

function toHHMMSS(sec_num) {
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    return minutes + ':' + seconds;
}

function getSongListDatas(callback) {
    var sql = 'SELECT * FROM audios';
    database.conn.query(sql , async (err, rows) => {
        if (err) throw err;
        else {
            var metadata = [];
            await asyncForEach(rows, async (num) => {
                if (fs.existsSync('uploads/'+num.filename)) {
                    meta = await getFormatedMetadata(num)
                    metadata.push({ meta, favorite: num.favorite, id: num.id});
                }
                else if (!fs.existsSync('uploads/'+num.filename)) {
                    sql2 = `DELETE FROM audios WHERE filename = '${num.filename}'`;
                    await database.conn.query(sql2, (err, rows) => {
                        if (err) throw err;
                        else {
                            console.log(`File ${num.filename} deleted`);
                        }
                    });
                }
            });
            return callback(metadata);
        }
    });
}
function getPlaylistSongs(playlistId, callback) {
    sql = `SELECT * FROM audios INNER JOIN playlists_songs ON audios.id = playlists_songs.song_id INNER JOIN playlists ON playlists_songs.playlist_id = playlists.id WHERE playlists.id = '${playlistId}' `;
    database.conn.query(sql, async (err, rows) => {
        if (err) throw err;
        else {
            var metadata = [];
            await asyncForEach(rows, async (num) => {
                if (fs.existsSync('uploads/' + num.filename)) {
                    meta = await getFormatedMetadata(num)
                    metadata.push({ meta, favorite: num.favorite, id: num.id });
                }
                else if (!fs.existsSync('uploads/' + num.filename)) {
                    sql2 = `DELETE FROM audios WHERE filename = '${num.filename}'`;
                    await database.conn.query(sql2, (err, rows) => {
                        if (err) throw err;
                        else {
                            console.log(`File ${num.filename} deleted`);
                        }
                    });
                }
            });
            return callback(metadata);
        }
    })
}
function getFavoritesSongs(callback) {
    sql = `SELECT * FROM audios WHERE favorite = 1 `;
    database.conn.query(sql, async (err, rows) => {
        if (err) throw err;
        else {
            var metadata = [];
            await asyncForEach(rows, async (num) => {
                if (fs.existsSync('uploads/' + num.filename)) {
                    meta = await getFormatedMetadata(num)
                    metadata.push({ meta, favorite: num.favorite, id: num.id });
                }
                else if (!fs.existsSync('uploads/' + num.filename)) {
                    sql2 = `DELETE FROM audios WHERE filename = '${num.filename}'`;
                    await database.conn.query(sql2, (err, rows) => {
                        if (err) throw err;
                        else {
                            console.log(`File ${num.filename} deleted`);
                        }
                    });
                }
            });
            return callback(metadata);
        }
    })
}
async function getFormatedMetadata(incomingFile) {
    var title, artist, picture;
    if (incomingFile !== undefined) {
        var metadata = await getMetadata(incomingFile);
        if (metadata !== undefined) {
            if (!('common' in metadata)) {
                title = incomingFile.filename.replace(incomingFile.filename.split('.').pop(), '');
                artist = 'Unknown';
                picture = 'unknown_cover.jpg';
            }
            else {
                if (!metadata.common.title) {
                    title = incomingFile.filename.replace(incomingFile.filename.split('.').pop(), '');
                }
                else {
                    title = metadata.common.title;
                }
                if (!metadata.common.artist) {
                    artist = 'Unknown';
                }
                else {
                    artist = metadata.common.artist;
                }
                if (!metadata.common.picture) {
                    picture = 'unknown_cover.jpg';
                }
                else {
                    picture = `data: ${metadata.common.picture[0].format};base64,${metadata.common.picture[0].data.toString('base64')}`;
                }
            }
        }
    }
    return { 'title': title, 'artist': artist, 'picture': picture, 'duration': toHHMMSS(Math.trunc(metadata.format.duration)), 'path': incomingFile.filename };
};

/*
function getPictureSrc(picture) {
    var res = '';
    if (picture) {
        res = `data: ${picture[0].format};base64,${picture[0].data.toString('base64')}`;
    }
    else if (!picture) {
        res = 'unknown_cover.jpg';
    }
    return res;
}*/

async function getMetadata(file) {
    try {
        var metadata = await mm.parseFile(`uploads/${file.filename}`);
    } catch (error) {
        console.error(error.message);
    }
    return metadata;
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}



module.exports = { getSongListDatas, getPlaylistSongs, getFavoritesSongs };