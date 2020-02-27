var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var ServerApi = require('../services/ApplicationServer');
var RedditApi = require('../services/RedditApi');
var GithubApi = require('../services/GithubApi');
var SlackApi = require('../services/SlackApi');
var TrelloApi = require('../services/TrelloApi');

var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({secret: "Dash_secret",
    resave: false,
    saveUninitialized: false
}));
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/', function(req, res) {
    var access_tokenCookie = req.cookies.access_token;

    if (!access_tokenCookie)
        res.redirect('/register');
    else
        res.redirect('/dashboard');
});

app.get('/disconnect', function (req, res) {
    res.clearCookie('access_token');
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

app.get('/error', function (req, res) {
    res.render('error.ejs');
});

app.post('/client/:action', async (req, res) => {
    if (req.params.action == 'register') {
        var email = req.body.emailRegister;
        var username = req.body.usernameRegister;
        var password = req.body.passwordRegister;
        var server = req.body.serverRegister;

        ServerApi.createUser(email, username, password, server, req, res);
    } else if (req.params.action == 'login') {
        var username = req.body.usernameLogin;
        var password = req.body.passwordLogin;
        var serverAddress = req.body.serverLogin;

        ServerApi.connectUser(username, password, serverAddress, req, res);
    } else {
        res.redirect('/error');
    }
});

app.get('/client/:action', async function (req, res) {
    if (req.params.action == 'getServerAddress') {
        res.json({
            success : true,
            token : req.cookies.access_token,
            server : req.cookies.server
        })
    } else if (req.params.action == 'getInitAction') {
        const result = await ServerApi.initGetActions(req, res, req.cookies.server, req.cookies.access_token);
        res.json({
            success : true,
            data : result.data
        })
    } else if (req.params.action == 'getInitReaction') {
        const result = await ServerApi.initGetReactions(req, res, req.cookies.server, req.cookies.access_token);
        res.json({
            success: true,
            data: result.data
        })
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
app.get('/authorizations/github', async function (req, res) {
    console.log('\n   ====== Github authorization ====== \n');
    GithubApi.generalSettings.code = req.query.code;
    var newres = await GithubApi.getAccessToken();
    GithubApi.generalSettings.authorizationToken = newres.data.split('&')[0].split('=')[1];
    ServerApi.setGithubAccessToken(req, res, GithubApi.generalSettings.authorizationToken);
});
app.get('/authorizations/reddit', async function (req, res) {
    console.log('\n   ====== Reddit authorization ====== \n');
    RedditApi.generalSettings.code = req.query.code;
    var newres = await RedditApi.getAccessToken();
    RedditApi.generalSettings.authorizationToken = newres.data.access_token;
    ServerApi.setRedditAccessToken(req, res, RedditApi.generalSettings.authorizationToken);
});
app.get('/authorizations/slack', async function (req, res) {
    console.log('\n   ====== Slack authorization ====== \n');
    SlackApi.generalSettings.code = req.query.code;
    var newres = await SlackApi.getAccessToken();
    SlackApi.generalSettings.authorizationToken = newres.data.authed_user.access_token;
    ServerApi.setSlackAccessToken(req, res, SlackApi.generalSettings.authorizationToken);
});
app.get('/authorizations/trello/pre-steps', async function (req, res) {
    console.log('\n   ====== Trello authorization - Part.1 ====== \n');
    TrelloApi.requestTokenUrl(res);
});
app.get('/authorizations/trello', async function (req, res) {
    console.log('\n   ====== Trello authorization - Part.2 ====== \n');
    TrelloApi.getAccessToken(req, res);
    console.log(TrelloApi.generalSettings);
    ServerApi.setTrelloAccessToken(req, res,
        TrelloApi.generalSettings.authorizationToken,
        TrelloApi.generalSettings.secretAuthorizationToken
    );
});

app.listen(8081);
app.on('listening', ()=>{});
