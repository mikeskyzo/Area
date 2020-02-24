var jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window);

onComplete = function(msg) {
    console.log('data ' + msg.data + ', response ' + msg.response.statusCode + ', request ' + msg.request.method);
};

onError = function(err) {
    console.error(err);
};

exports.connectUser = function(username, password, server, req, res) {
    var url = server + '/connectUser';

    $.ajax({
        method : "post",
        data : "username=" + username + "&password=" + password,
        crossDomain : true,
        url : url,
        success : function (data) {
            res.cookie('access_token', data.token);
            res.cookie('server', server);
            res.redirect('/dashboard');
        },
        error : function (data, status, error) {
            res.redirect('/error');
        }
    });
};

exports.createUser = function(email, Uname, Pword, server, req, res) {
    var url = server + '/createUser';

    $.ajax({
        method : "post",
        data : 'username=' + Uname + '&password=' + Pword,
        crossDomain : true,
        url : url,
        success : async (data) => {
            res.cookie('access_token', data.token);
            res.cookie('server', server);
            res.redirect('/dashboard');
        },
        error : function (data, status, error) {
            res.redirect('/test');
        }
    });
};