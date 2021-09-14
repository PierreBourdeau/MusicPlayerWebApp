/*var database = require('../DB_connection/database');
var bcrypt = require('bcrypt');
const express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
router.use(bodyParser.json());

//
var passport = require('passport');
var session = require('express-session');

//
router.use(passport.initialize())
router.use(passport.session())
router.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
}));
//

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated) {
        return next()
    }

    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

router.get('/', checkNotAuthenticated,  function (req, resp) {
    resp.render('index', { view: 'login', datas: '' });
});

router.post('/', checkNotAuthenticated, function (req, resp)  passport.authenticate('local', {
        let data = req.body.credentials;
        var sql = 'SELECT * FROM user_db WHERE user_email = ? ';
        database.conn.query(sql, data.email, async (err, rows) => {
            if (err) throw err;
            else {
                if (rows.length > 0) {
                    const result = await bcrypt.compare(data.password, rows[0].user_password);
                    if (result) {
                        resp.send({ status: 1 });
                    }
                    else if (!result) {
                        console.log("Password is incorrect");
                        resp.send({ status: 0 });
                    }
                }
                else {
                    console.log(`No user registered as ${data.email}, Register !`);
                    resp.send({ status: 3 });
                }
            }
        });
    
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

//});

module.exports = router;*/