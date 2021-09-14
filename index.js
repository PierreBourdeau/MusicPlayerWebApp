//Environment variables
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

//setup express server
var express = require('express');
var app = express();
app.use(express.urlencoded({ extended: false }));

//Getting 'Components' (or Routes)
var songTab = require('./Components/tile');
var uploadFiles = require('./Components/uploadFiles');
var deleteFiles = require('./Components/deleteFiles');
var registerUser = require('./Components/registerServerSide');
var navBar = require('./Components/sideNavBarServerSide');
var playlist = require('./Components/playlists');
var syncFolder = require('./Components/syncFolder');

//Multer config.
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        if (!fs.existsSync('./uploads/' + file.originalname)) {
            cb(null, file.originalname)
        } else {
            console.log(`The file ${file.originalname} is already added`);
        }
    }
});
var upload = multer({ storage, preservePath: true });

var storagePP = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './ressources/profilePicture')
    },
    filename: async function (req, file, cb) {
        await fs.readdir('./ressources/profilePicture', (err, files) => {
            if (err) throw err;
            else {
                if (files.length == 0) {
                    cb(null, file.originalname);
                }
                else {
                    for (let iFile of files) {
                        fs.unlink('./ressources/profilePicture/' + iFile, err => {
                            if (err) throw err;
                        })
                    }
                    cb(null, file.originalname);
                }
            }
        })
    }
});
var uploadPP = multer({ storage: storagePP, preservePath: true });

//NodeJS FileSystem
var fs = require('fs');

//NodeJS BodyParser
var bodyParser = require('body-parser');
app.use(bodyParser.json());

//Database link
var database = require('./DB_connection/database');

//Session management (Passeport, express-session, express-flash)
var session = require('express-session');
var passport = require('passport');
var flash = require('express-flash');
//Session handling database
var mysql = require('mysql');
var session_handler = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'session_handler',
        clearExpired: true,
        checkExpirationInterval: 900000,
        expiration: 86400000,
        createDatabaseTable: true,
        endConnectionOnClose: true,
    }
);

var MySQLStore = require('express-mysql-session')(session);
var sessionStore = new MySQLStore(session_handler);

const initializePassport = require('./passport-config');
initializePassport(
    passport,
    email => {
        return new Promise((resolve, reject) => {
            var sql = 'SELECT * FROM user_db WHERE user_email = ? ';
            database.conn.query(sql, email, async (err, rows) => {
                if (err) return reject(err);
                else {
                    return resolve(rows[0]);
                }
            });
        })
    },
    (id) => {
        return new Promise((resolve, reject) => {
            var sql = 'SELECT * FROM user_db WHERE user_id = ? ';
            database.conn.query(sql, id, async (err, rows) => {
                if (err) return reject(err);
                else {
                    return resolve(rows[0]);
                }
            });
        })
    },
);

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    //store: sessionStore,
}));
app.use(flash());
app.use(passport.initialize())
app.use(passport.session())


//View management EJS
app.set('views', './views');
app.set('view engine', 'ejs');

//App static files
app.use(express.static('./style'));
app.use(express.static('./ressources'));
app.use(express.static('./ressources/profilePicture'));
app.use(express.static('./public'));
app.use(express.static('./uploads'));


// ------------- ROUTES -------------

//Main-page
app.get('/home', checkAuthenticated, async function (req, resp) {
    await songTab.getSongListDatas(async function (result) {
        sessUser = await req.user;
        datas = result;
        await playlist.getUserAllPlaylists(sessUser.user_id, function (rows) {
            plists = rows;
            resp.render('homepage', { sidebar: 'side-navbar', songtab: 'song-tab', bottomplaybar: 'bottom-play-bar', datas: datas, playlists: plists, userName: sessUser.user_name, userPP: sessUser.user_pp });
        })
    });
});


app.get('/register', function (req, resp) {
        resp.render('register');
    })

app.post('/register', uploadPP.single('userPpInput'), async function (req, resp) {
    if (req.file == undefined) {
        req.body.userProfilePicture = 'unknown_cover.jpg';
    }
    else {
        req.body.userProfilePicture = ('/profilePicture/' + req.file.filename);
    }
    await registerUser.register(req.body, function (aBoolean) {
        if (aBoolean) {
            resp.redirect('/login');
        }
    })
});


app.post('/upload', upload.array('import_song'), async function (req, resp) {
    var datas = [];
    datas = await uploadFiles.getFormatedDatas(req.files);
    await uploadFiles.uploadSongs(datas);
});

app.post('/delete', checkAuthenticated, async function (req, resp) {
    deleteFiles.deleteSong(req.body.title);
    fs.unlink('./uploads/' + req.body.title, (err) => {
        if (err) throw err;
        console.log('File deleted');
    });
});

app.post('/syncAll', async function (req, resp) {
})

//_______________LOGIN_______________
app.get('/login', checkNotAuthenticated, function (req, resp) {
    resp.render('login');
});

app.post('/login', checkNotAuthenticated,  passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash: true
}));

app.post('/pp', checkAuthenticated, uploadPP.single('profilePictureInput'), async function (req, resp) {
    let user = await req.user;
    await playlist.getUserAllPlaylists(user.user_id, async function (rows) {
        await navBar.updatePP(sessUser.user_email, req.file.originalname, async function (newPp) {
            newPlists = rows;
            resp.render('side-navbar', { playlists: newPlists, userName: user.user_name, userPP: newPp });
        });
    })
});

app.post('/createPlaylist', checkAuthenticated, async function (req, resp) {
    let user = await req.user;
    await playlist.createPlaylist(user.user_id, req.body.playlistName, async function () {
        await playlist.getUserAllPlaylists(user.user_id, function (rows) {
            newPlists = rows;
            resp.render('side-navbar', { playlists: newPlists, userName: user.user_name, userPP: user.user_pp });
        })
    })
})

app.post('/loadPlaylist', checkAuthenticated, async function (req, resp) {
    await songTab.getPlaylistSongs(req.body.playlistId, async function (result) {
        sessUser = await req.user;
        datas = result;
        await playlist.getUserAllPlaylists(sessUser.user_id, function (rows) {
            plists = rows;
            resp.render('song-tab', { datas: datas, playlists: plists, userName: sessUser.user_name, userPP: sessUser.user_pp });
        })
    });
}); 

app.get('/loadLibrary', checkAuthenticated, async function (req, resp) {
    let user = req.user;
    await songTab.getSongListDatas(async function (result) {
        datas = result;
        await playlist.getUserAllPlaylists(sessUser.user_id, function (rows) {
            plists = rows;
            resp.render('song-tab', { datas: datas, playlists: plists, userName: user.user_name, userPP: user.user_pp });
        })
    });
})
app.get('/loadFavoritesLibrary', checkAuthenticated, async function (req, resp) {
    let user = req.user;
    await songTab.getFavoritesSongs(async function (result) {
        datas = result;
        await playlist.getUserAllPlaylists(sessUser.user_id, function (rows) {
            plists = rows;
            resp.render('song-tab', { datas: datas, playlists: plists, userName: user.user_name, userPP: user.user_pp });
        })
    });
})

app.post('/addFavorite', checkAuthenticated, async function (req, resp) {
    await playlist.changeFavoriteStatus(req.body.songId);
    resp.send();
})

app.post('/addToPlaylist', checkAuthenticated, async function (req, resp) {
    await playlist.addToPlaylist(req.body.playlistId, req.body.songId);
    resp.send();
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/home')
    }
    next()
}

app.listen(3000);