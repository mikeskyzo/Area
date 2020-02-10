var express = require('express');

var app = express();

app.set('view engine', 'ejs');
app.get('/', function(req, res) {
    res.redirect('/login');
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

app.listen(8081);
app.on('listening', ()=>{});
