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

app.listen(8081);
app.on('listening', ()=>{});