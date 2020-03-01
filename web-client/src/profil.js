
document.addEventListener("DOMContentLoaded", function (req, res) {

    async function checkIfConnectedToService() {
        const resGithub = await checkGithub();
        const resReddit = await checkReddit();
        const resSlack = await checkSlack();
        const resTrello = await checkTrello();

        changeButtonIfConnected(resGithub.service, resReddit.service, resSlack.service, resTrello.service)
    }

    function checkTrello() {
        var url = "http://localhost:8081/client/getTrelloLoginStatus";

        return $.ajax({
            method : "get",
            crossDomain : true,
            url : url,
        });
    }

    function checkSlack() {
        var url = "http://localhost:8081/client/getSlackLoginStatus";

        return $.ajax({
            method : "get",
            crossDomain : true,
            url : url,
        });
    }

    function checkReddit() {
        var url = "http://localhost:8081/client/getRedditLoginStatus";

        return $.ajax({
            method : "get",
            crossDomain : true,
            url : url,
        });
    }

    function checkGithub() {
        var url = "http://localhost:8081/client/getGithubLoginStatus";

        return $.ajax({
            method : "get",
            crossDomain : true,
            url : url,
        });
    }

    function changeButtonIfConnected(Github, Reddit, Slack, Trello) {
        var btnGithub = document.getElementById("btnGithub");
        var btnReddit = document.getElementById("btnReddit");
        var btnSlack = document.getElementById("btnSlack");
        var btnTrello = document.getElementById("btnTrello");

        if (Github === "true") {
            btnGithub.textContent = "Github : Connected"
        } else {
            btnGithub.textContent = "Github"
        }
        if (Reddit === "true") {
            btnReddit.textContent = "reddit : Connected"
        } else {
            btnReddit.textContent = "reddit"
        }
        if (Slack === "true") {
            btnSlack.textContent = "Slack : Connected"
        } else {
            btnSlack.textContent = "Slack"
        }
        if (Trello === "true") {
            btnTrello.textContent = "Trello : Connected"
        } else {
            btnTrello.textContent = "Trello"
        }
    }

    checkIfConnectedToService();
});
