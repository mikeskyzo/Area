
$(document).ready(function(){
    $('.modal').modal();
});

document.addEventListener("DOMContentLoaded", function (req, res) {

    var errorContainer = document.getElementById("error-container");

    async function initRegisterPage() {
        const resRegister = await getRegisterStatus();

        if (resRegister.success === false) {
            let errorMessage = '' +
                '<div id="message" class="black-text" style="font-size: 20px">' + resRegister.data + '</div>';

            errorContainer.innerHTML = errorMessage;
        }
    }

    function getRegisterStatus() {
        var url = "http://localhost:8081/client/getRegisterStatus";

        return $.ajax({
            method : "get",
            crossDomain : true,
            url : url,
        });
    }

    initRegisterPage();
});