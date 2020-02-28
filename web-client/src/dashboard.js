var serverAddress = "";
var accessToken = "";

$(document).ready(function(){
    $('.tabs').tabs();
});

document.addEventListener('DOMContentLoaded', function (req, res) {

    var actionList = document.getElementById("action-list");
    var reactionList = document.getElementById("reaction-list");

    async function initArea() {
        const resAction = await initAction();
        const resReaction = await initReaction();

        console.log("result action : ", resAction);
        console.log("result reaction : ", resReaction);
    }

    /*function getServerAddress()  {
        var url = "http://localhost:8081/client/getServerAddress";

        return $.ajax({
            method : "get",
            crossDomain : true,
            url : url,
        });
    }*/

    function initAction() {
        var url = "http://localhost:8081/client/getInitAction";

        return $.ajax({
            method : "get",
            crossDomain : true,
            url : url,
        });
    }

    function initReaction() {
        var url = "http://localhost:8081/client/getInitReaction";

        return $.ajax({
            method : "get",
            crossDomain : true,
            url : url,
        });
    }

    initArea();
});
