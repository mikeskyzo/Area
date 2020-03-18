
$(document).ready(function(){
    $('.modal').modal();
});

document.addEventListener("DOMContentLoaded", function (req, res) {

    var errorContainer = document.getElementById("error-container");

    async function initLoginPage() {
        const resLogin = await getLoginStatus();

        if (resLogin.success === false) {
            let errorMessage = '' +
                '<div id="message" class="orange-text" style="font-size: 20px">' + resLogin.data + '</div>';

            errorContainer.innerHTML = errorMessage;
        }
    }

    function getLoginStatus() {
        var url = "http://localhost:8081/client/getLoginStatus";

        return $.ajax({
            method : "get",
            crossDomain : true,
            url : url,
        });
    }

    initLoginPage();
});