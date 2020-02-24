var express = require('express');
var bodyParser = require('body-parser');
var apiUser = require('./apiCall');
var cookieParser = require('cookie-parser');
var session = require('express-session');


var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({secret: "Dash_secret",
    resave: false,
    saveUninitialized: false
}));

app.get('/', function(req, res) {
    var access_tokenCookie = req.cookies.access_token;

    if (!access_tokenCookie)
        res.redirect('/register');
    else
        res.redirect('dashboard');
});

app.get('/home', function (req, res) {
    res.render('home.ejs');
});

app.get('/login', function (req, res) {
    res.render('login.ejs');
});

app.get('/register', function (req, res) {
    res.render('register.ejs');
});

app.get('/dashboard', function (req, res) {
    res.render('dashboard.ejs');
});

app.get('/profil', function (req, res) {
    res.render('profil.ejs');
});

app.get('/error', function (req, res) {
    res.render('error.ejs');
});

app.post('/client/:action', async (req, res) => {
    if (req.params.action == 'register') {
        var email = req.body.emailRegister;
        var username = req.body.usernameRegister;
        var password = req.body.passwordRegister;
        var server = req.body.serverRegister;

        apiUser.createUser(email, username, password, server, req, res);
    } else if (req.params.action == 'login') {
        var username = req.body.usernameLogin;
        var password = req.body.passwordLogin;
        var serverAddress = req.body.serverLogin;

        apiUser.connectUser(username, password, serverAddress, req, res);
    } else {
        res.redirect('/error');
    }
});

app.get('/mobile', function (req, res) {
    res.render('mobile.ejs');
});

app.get('/client.apk', function (req, res) {
    const path = require('path');
    const fs = require('fs');

    const filePath = "./public/app/release/";
    const fileName = "app-release.apk";

    fs.access(path.join(filePath, fileName), fs.F_OK, (err) => {
        if (err)
            console.error(err);
        else
            res.download(path.join(filePath, fileName));
    });
});

// Authorizations
app.get('/authorizations/reddit', function(req, res) {
    console.log(req.data);
    res.render('profil.ejs');
    //res.redirect('/profil');
});

app.listen(8081);
app.on('listening', ()=>{});
