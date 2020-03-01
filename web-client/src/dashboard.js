$(document).ready(function(){
    $('.tabs').tabs();
});

document.addEventListener('DOMContentLoaded', function (req, res) {

    var actionList = document.getElementById("action-list");
    var reactionList = document.getElementById("reaction-list");
    var actionCreator = document.getElementById("action-creator");
    var reactionCreator = document.getElementById("reaction-creator");
    var createArea = document.getElementById("create-area-button");

    var areaList = document.getElementById("area-list");

    var actionName = "";
    var reactionName = "";
    var actionParamName = [];
    var reactionParamName = [];
    var actionParamValue = [];
    var reactionParamValue = [];
    var actionParam = [];
    var reactionParam = [];


    async function initArea() {
        const resAction = await getAction();
        const resReaction = await getReaction();
        const resArea = await getArea();

        displayAction(resAction);
        displayReaction(resReaction);
        setCreateArea();

        displayArea(resArea);
    }

    // --------------------------------------------------------------------------------- //
    //                            function display area                                  //
    // --------------------------------------------------------------------------------- //

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
            '<div>' + elem.name + ' : ' + elem.value + '</div>';
        return params
    }

    function createAreaTemplate(elem) {
        var params = '' +
            '<div id="' + elem.area_id + '_' + elem.area_name + '" style="background: blue">' +
                '<span>' + elem.area_name + '</span>' +
                '<a id="' + elem.area_id + '" class="right btn-floating btn-small waves-effect waves-light orange"><i class="material-icons">close</i></a>' +
                '<div class="col s12">' +
                    '<div id="areaAction" class="col s6" style="background: red">' +
                        '<div class="center">Action : ' + elem.action.name + '</div>' +
                        '<div id="areaActionParameters">';

        elem.action.params.forEach(elem =>
            params += createAreaParamsTemplate(elem)
        );

        params += '</div>' +
            '</div>' +
            '<div id="areaReaction" class="col s6" style="background: yellow">' +
            '<div class="center">Reaction : ' + elem.reaction.name + '</div>' +
            '<div id="areaReactionParameters">';

        elem.reaction.params.forEach(elem =>
            params += createAreaParamsTemplate(elem)
        );

        params += '</div></div></div></div>';

        return params;
    }
    
    function displayArea(area) {
        var areaHtml = '' +
        '<div></div>' ;

        area.data.forEach(elem =>
            areaHtml += createAreaTemplate(elem)
        );
        area.data.forEach(elem =>
            setAreaDeleteButton(elem)
        );
        areaList.innerHTML = areaHtml;
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
            data : "area=" + dataParse
        });
    }
    
    function createAreaFunction() {
        for (var i = 0; i != actionParam.length; i++)
            actionParamValue[i] = document.getElementById(actionParam[i]).value;
        for (var i = 0; i != reactionParam.length; i++)
            reactionParamValue[i] = document.getElementById(reactionParam[i]).value;

        var data =
            JSON.stringify({
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
    //                               function reaction                                   //
    // --------------------------------------------------------------------------------- //

    function createReactionParamsTemplate(elem, reactionName) {
        reactionParamName.push(elem.name);
        reactionParam.push(reactionName + '_' + elem.name);

        var params = '' +
            '<div class="input-field" style="margin-top: 10px;">' +
            '<input id="' + reactionName + '_' + elem.name + '" type="text">' +
            '<label for="' + reactionName + '_' + elem.name + '">' + elem.name + '</label>' +
            '</div>' +
            '<div style="margin-bottom: 10px">' + elem.description + '</div>'
        return params;
    }

    function executeReaction(reaction) {
        reactionParamName = [];
        reactionParam = [];
        reactionName = reaction.name;
        let paramsHtml = '' +
            '<div class="center" style="margin-top: 10px; font-size: 20px"><b>Reaction : ' + reaction.name + '</b></div>';

        reaction.params.forEach(elem =>
            paramsHtml += createReactionParamsTemplate(elem, reaction.name)
        );
        reactionCreator.innerHTML = paramsHtml;
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
                '<span class="orange right">' + elem.service + '</span><br>' +
                '<span class="orange right">' + elem.title + '</span>' +
                '<a id="' + elem.name + '" class="left btn-floating btn waves-effect waves-light orange" style="margin-bottom: 10px"><i class="material-icons">keyboard_arrow_left</i></a><br>' +
                '<span class="orange right">' + elem.description + '</span><br>' +
            '</div>' +
            '<div style="border-bottom: 4px solid #ff9800;"></div>'
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
                '<input id="' + actionName + '_' + elem.name + '" type="text">' +
                '<label for="' + actionName + '_' + elem.name + '">' + elem.name + '</label>' +
            '</div>' +
            '<div style="margin-bottom: 10px">' + elem.description + '</div>'
        return params;
    }

    function executeAction(action) {
        actionParamName = [];
        actionParam = [];
        actionName = action.name;
        let paramsHtml = '' +
            '<div class="center" style="margin-top: 10px; font-size: 20px"><b>Action : ' + action.name + '</b></div>';

        action.params.forEach(elem =>
            paramsHtml += createActionParamsTemplate(elem, action.name)
        );
        actionCreator.innerHTML = paramsHtml;
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
                '<span class="orange">' + elem.service + '</span><br>' +
                '<span class="orange">' + elem.title + '</span>' +
                '<a id="' + elem.name + '" class="right btn-floating btn waves-effect waves-light orange" style="margin-bottom: 10px"><i class="material-icons">keyboard_arrow_right</i></a><br>' +
                '<span class="orange">' + elem.description + '</span><br>' +
            '</div>' +
            '<div style="border-bottom: 4px solid #ff9800;"></div>'
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
    //                                      requete                                      //
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

    initArea();
});
