var express = require('express');

var app = express();

app.get('/', function(req, res) {
    res.redirect('/home');
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

app.listen(8000);
app.on('listening', ()=>{});