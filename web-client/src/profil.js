
document.addEventListener("DOMContentLoaded", function (req, res) {

    var buttonList = document.getElementById("button-list");

    var disconnectButton = [];

    async function initProfilePage() {
        const serviceStatus = await getService();

        initServices(serviceStatus);
    }

    // --------------------------------------------------------------------------------- //
    //                                connexion services                                 //
    // --------------------------------------------------------------------------------- //

    function sendDeconnexion(elem) {
        var url = "http://localhost:8081/client/disconnectService";

        $.ajax({
            method : "post",
            crossDomain : true,
            url : url,
            data : "service=" + elem
        });
    }

    function setDisconnectButton(elem) {
        var button = document.getElementById(elem);
        button.addEventListener('click', function(){
            sendDeconnexion(elem);
        }, false);
    }

    function createDeconnexionButton(elem, status) {
        disconnectButton.push(elem.service);
        var button = '' +
            '<a id="' + elem.service + '" class="btnOAuth center waves-effect waves-light orange btn">' + elem.service + status + '</a><br>';
        return button;
    }

    function createConnexionButton(elem, status, server, token) {
        var button = '' +
            '<a href="' + server + '/Auth/connect/' + elem.service + '?token=' + token + '" class="btnOAuth center waves-effect waves-light orange btn">' + elem.service + status + '</a><br>';
        return button;
    }

    function checkIfConnected(elem, server, token) {
        if (elem.active === true)
            return createDeconnexionButton(elem, " : Connected", server, token);
         else
            return createConnexionButton(elem, " : Not Connected", server, token);
    }

    function initServices(servicesStatus) {
        let connexionButton = "";
        disconnectButton = [];

        console.log(servicesStatus);

        servicesStatus.data.forEach(elem =>
            connexionButton += checkIfConnected(elem, servicesStatus.server, servicesStatus.token)
        );
        buttonList.innerHTML = connexionButton;
        disconnectButton.forEach(elem =>
            setDisconnectButton(elem)
        );
    }


    // --------------------------------------------------------------------------------- //
    //                                      request                                      //
    // --------------------------------------------------------------------------------- //

    function getService() {
        var url = "http://localhost:8081/client/getServices";

        return $.ajax({
            method : "get",
            crossDomain : true,
            url : url,
            success : function (data) {
                console.log("getService OK");
            },
            error : function (data, status, error) {
                console.log(data);
                console.log(status);
                console.log(error);
            }
        });
    }

    // Start program
    initProfilePage()
});
