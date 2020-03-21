$(document).ready(function(){
    $('.tabs').tabs();
});

$(document).ready(function(){
    $('.modal').modal();
});

document.addEventListener('DOMContentLoaded', function (req, res) {

    var actionList = document.getElementById("action-list");
    var reactionList = document.getElementById("reaction-list");
    var actionCreator = document.getElementById("action-creator");
    var reactionCreator = document.getElementById("reaction-creator");
    var areaCreator = document.getElementById("area-creator");
    var createArea;
    var areaResult;

    var areaList = document.getElementById("area-list");

    var actionName = "";
    var reactionName = "";
    var actionParamName = [];
    var reactionParamName = [];
    var actionParamValue = [];
    var reactionParamValue = [];
    var actionParam = [];
    var reactionParam = [];

    var isActionDisplay = false;
    var isReactionDisplay = false;


    async function initArea() {
        const resAction = await getAction();
        const resReaction = await getReaction();
        const resArea = await getArea();

        displayAction(resAction);
        displayReaction(resReaction);
        createRefreshButton();
        displayArea(resArea);


    }

    // --------------------------------------------------------------------------------- //
    //                            function display area                                  //
    // --------------------------------------------------------------------------------- //

    async function areaDisplayRefresh() {
        const resArea = await getArea();
        displayArea(resArea);
    }

    function createRefreshButton() {
        var areaRefreshButton = document.getElementById("area-refresh-button");
        areaRefreshButton.addEventListener('click', function(){
            areaDisplayRefresh();
        }, false);
    }

    function deleteArea(elem) {
        var url = "http://localhost:8081/client/deleteArea";

        $.ajax({
            method : "post",
            crossDomain : true,
            url : url,
            data : "area_id=" + elem.area_id,
            success : async (data) => {
                document.getElementById(elem.area_id + '_' + elem.area_name).outerHTML = "";
            }
        });
    }

    function setAreaDeleteButton(elem) {
        var button = document.getElementById(elem.area_id);
        button.addEventListener('click', function(){
            deleteArea(elem);
        }, false);
    }

    function createAreaParamsTemplate(elem) {
        var params = '' +
            '<div style="margin-left: 10px"><i>' + elem.name + '</i> : ' + elem.value + '</div>';
        return params
    }

    function createAreaTemplate(elem) {
        var params = '' +
            '<div id="' + elem.area_id + '_' + elem.area_name + '" style="margin: 20px 40px 20px;">' +
                '<div style="font-size: 30px; margin-left: 10px"><b>' + elem.area_name +
                '</b><a id="' + elem.area_id + '" class="right btn-floating btn-small waves-effect waves-light black" style="margin-right: 10px; margin-top: 5px"><i class="material-icons white-text">close</i></a></div>' +
                '<div class="col s12" style="background: white;  border: 4px solid #000000;">' +
                    '<div id="areaAction" class="col s6" style="background: white;">' +
                        '<div class="center" style="font-size: 20px"><u>Action : ' + elem.action.name + '</u></div>' +
                        '<div id="areaActionParameters">';

        elem.action.params.forEach(elem =>
            params += createAreaParamsTemplate(elem)
        );

        params += '</div>' +
            '</div>' +
            '<div id="areaReaction" class="col s6" style="background: white;">' +
            '<div class="center" style="font-size: 20px"><u>Reaction : ' + elem.reaction.name + '</u></div>' +
            '<div id="areaReactionParameters">';

        elem.reaction.params.forEach(elem =>
            params += createAreaParamsTemplate(elem)
        );

        params += '</div></div></div></div>';

        return params;
    }

    function displayArea(area) {
        var areaHtml = '';

        area.data.forEach(elem =>
            areaHtml += createAreaTemplate(elem)
        );

        areaList.innerHTML = areaHtml;

        area.data.forEach(elem =>
            setAreaDeleteButton(elem)
        );
    }

    // --------------------------------------------------------------------------------- //
    //                               function create area                                //
    // --------------------------------------------------------------------------------- //

    function sendAreaToServer(dataParse) {
        var url = "http://localhost:8081/client/createArea";

        $.ajax({
            method : "post",
            crossDomain : true,
            url : url,
            data : "area=" + dataParse,
            success : function (data) {
                areaResult.innerHTML = '' +
                    '<div>' + data.result + '</div>';
            },
        });
    }

    function createAreaFunction() {
        actionParamValue = [];
        reactionParamValue = [];

        var areaName = document.getElementById("areaName").value;

        for (var i = 0; i != actionParam.length; i++)
            actionParamValue[i] = document.getElementById(actionParam[i]).value;
        for (var i = 0; i != reactionParam.length; i++)
            reactionParamValue[i] = document.getElementById(reactionParam[i]).value;

        var data =
            JSON.stringify({
                "area_name" : areaName,
                "action" : {
                    "name" : actionName,
                    "params" : [
                    ]
                },
                "reaction" : {
                    "name" : reactionName,
                    "params" : [
                    ]
                }
            });

        var dataParse = JSON.parse(data);

        for (var i = 0; i != actionParamValue.length; i++) {
            var paramAction = {
                "name" : actionParamName[i],
                "value" : actionParamValue[i]
            };
            dataParse.action.params.push(paramAction)
        }

        for (var i = 0; i != reactionParamValue.length; i++) {
            var paramReaction = {
                "name" : reactionParamName[i],
                "value" : reactionParamValue[i]
            };
            dataParse.reaction.params.push(paramReaction)
        }
        sendAreaToServer(JSON.stringify(dataParse));
    }

    function setCreateArea() {
        createArea.addEventListener('click', createAreaFunction);
    }

    // --------------------------------------------------------------------------------- //
    //                          function display create                                  //
    // --------------------------------------------------------------------------------- //

    function displayAreaCreation() {
        var htmlCode = '' +
            '<div class="input-field" style="margin-top: 10px;">' +
            '<input id="areaName" type="text" class="black-text">' +
            '<label for="areaName">Area name</label>' +
            '</div>' +
            '<div style="border-bottom: 4px solid #1b1b1b; margin-top: 20px; margin-bottom: 20px"></div>' +
            '<div class="center">' +
            '<div id="area-create-result"></div>' +
            '<a id="create-area-button" class="black waves-effect waves-light btn-large white-text" style="margin-top: 10px"><i class="material-icons left">add</i><b>Create Area</b></a>' +
            '</div>';

        areaCreator.innerHTML = htmlCode;
        createArea = document.getElementById("create-area-button");
        areaResult = document.getElementById("area-create-result");


        setCreateArea();
    }

    function isAreaAvailable() {
        if (isReactionDisplay == true && isActionDisplay == true)
            displayAreaCreation();
    }



    // --------------------------------------------------------------------------------- //
    //                               function reaction                                   //
    // --------------------------------------------------------------------------------- //

    function createReactionParamsTemplate(elem, reactionName) {
        reactionParamName.push(elem.name);
        reactionParam.push(reactionName + '_' + elem.name);

        var params = '' +
            '<div class="input-field" style="margin-top: 10px;">' +
            '<input id="' + reactionName + '_' + elem.name + '" type="text" class="black-text">' +
            '<label for="' + reactionName + '_' + elem.name + '">' + elem.name + '</label>' +
            '</div>' +
            '<div style="margin-bottom: 10px; margin-left: 30px;"> <i class="material-icons small">subdirectory_arrow_right</i>' + elem.description + '</div>'
        return params;
    }

    function executeReaction(reaction) {
        isReactionDisplay = true;

        console.log(reactionParamName);
        reactionParamName = [];
        reactionParam = [];
        reactionName = reaction.name;
        let paramsHtml = '' +
            '<div class="center black-text" style="margin-top: 10px; font-size: 20px"><b>Reaction : ' + reaction.name + '</b></div>';

        reaction.params.forEach(elem =>
            paramsHtml += createReactionParamsTemplate(elem, reaction.name)
        );
        paramsHtml += '<div style="border-bottom:  4px solid #1b1b1b; margin-top: 20px; margin-bottom: 20px"></div>';
        reactionCreator.innerHTML = paramsHtml;        console.log(areaName);


        isAreaAvailable();
    }

    function setReactionButton(elem) {
        var button = document.getElementById(elem.name);
        button.addEventListener('click', function(){
            executeReaction(elem);
        }, false);
    }

    function createReactionTemplate(elem) {
        var newReaction = '' +
            '<div style="margin: 20px">' +
                '<span class="white-text right"><b>' + elem.service + '</b></span><br>' +
                '<span class="white-text right"><u>' + elem.title + ' :</u></span>' +
                '<a id="' + elem.name + '" class="left btn-floating btn waves-effect waves-light white" style="margin-bottom: 10px"><i class="material-icons black-text">keyboard_arrow_left</i></a><br>' +
                '<span class="white-text right">' + elem.description + '</span><br>' +
            '</div>' +
            '<div style="border-bottom: 4px solid white;"></div>'
        return newReaction;
    }

    function displayReaction(reaction) {
        let reactionHtml = "";

        reaction.data.forEach(elem =>
            reactionHtml += createReactionTemplate(elem)
        );
        reactionList.innerHTML = reactionHtml;
        reaction.data.forEach(elem =>
            setReactionButton(elem)
        );
    }

    // --------------------------------------------------------------------------------- //
    //                                 function action                                   //
    // --------------------------------------------------------------------------------- //

    function createActionParamsTemplate(elem, actionName) {
        actionParamName.push(elem.name);
        actionParam.push(actionName + '_' + elem.name);

        var params = '' +
            '<div class="input-field" style="margin-top: 10px">' +
                '<input id="' + actionName + '_' + elem.name + '" type="text" class="black-text">' +
                '<label for="' + actionName + '_' + elem.name + '">' + elem.name + '</label>' +
            '</div>' +
            '<div style="margin-bottom: 10px; margin-left: 30px;"> <i class="material-icons small">subdirectory_arrow_right</i>' + elem.description + '</div>'
        return params;
    }

    function executeAction(action) {
        isActionDisplay = true;

        actionParamName = [];
        actionParam = [];
        actionName = action.name;
        let paramsHtml = '' +
            '<div class="center black-text" style="margin-top: 10px; font-size: 20px"><b>Action : ' + action.name + '</b></div>';

        action.params.forEach(elem =>
            paramsHtml += createActionParamsTemplate(elem, action.name)
        );
        paramsHtml += '<div style="border-bottom:  4px solid #1b1b1b; margin-top: 20px; margin-bottom: 20px"></div>';
        actionCreator.innerHTML = paramsHtml;

        isAreaAvailable();
    }

    function setActionButton(elem) {
        var button = document.getElementById(elem.name);
        button.addEventListener('click', function(){
            executeAction(elem);
        }, false);
    }

    function createActionTemplate(elem) {
        var newAction = '' +
            '<div style="margin: 20px">' +
                '<span class="white-text"><b>' + elem.service + '</b></span><br>' +
                '<span class="white-text"><u>' + elem.title + ' :</u></span>' +
                '<a id="' + elem.name + '" class="right btn-floating btn waves-effect waves-light white" style="margin-bottom: 10px"><i class="material-icons black-text">keyboard_arrow_right</i></a><br>' +
                '<span class="white-text">' + elem.description + '</span><br>' +
            '</div>' +
            '<div style="border-bottom: 4px solid white;"></div>'
        return newAction;
    }

    function displayAction(action) {
        let actionHtml = "";

        action.data.forEach(elem =>
            actionHtml += createActionTemplate(elem)
        );
        actionList.innerHTML = actionHtml;
        action.data.forEach(elem =>
            setActionButton(elem)
        );
    }

    // --------------------------------------------------------------------------------- //
    //                                      request                                      //
    // --------------------------------------------------------------------------------- //

    function getAction() {
        var url = "http://localhost:8081/client/getInitAction";

        return $.ajax({
            method : "get",
            crossDomain : true,
            url : url,
        });
    }

    function getReaction() {
        var url = "http://localhost:8081/client/getInitReaction";

        return $.ajax({
            method : "get",
            crossDomain : true,
            url : url,
        });
    }

    function getArea() {
        var url = "http://localhost:8081/client/getInitArea";

        return $.ajax({
            method : "get",
            crossDomain : true,
            url : url,
        });
    }

    // Start program
    initArea();
});
