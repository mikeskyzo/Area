var jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window);

exports.initGetActions = function() {
    var url = serverAddress + "/getActions";

    $.ajax({
        method : "get",
        url : url,
        crossDomain : true,
        headers: {
            authorization: `token ${accessToken}`
        },
        success : function (data) {
            console.log(data);
        },
        error : function (data, status, error) {
            console.log(data);
            console.log(status);
            console.log(error);
        }
    });
};