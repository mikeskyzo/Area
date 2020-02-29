$(document).ready(function(){
    $('.tabs').tabs();
});

document.addEventListener('DOMContentLoaded', function (req, res) {

    var actionList = document.getElementById("action-list");
    var reactionList = document.getElementById("reaction-list");

    var actionCreator = document.getElementById("action-creator");
    var reactionCreator = document.getElementById("reaction-creator");

    async function initArea() {
        const resAction = await getAction();
        const resReaction = await getReaction();
        const resArea = await getArea();

        console.log(resAction);
        console.log(resReaction);

        displayAction(resAction);
        displayReaction(resReaction);
    }

    // --------------------------------------------------------------------------------- //
    //                               function reaction                                   //
    // --------------------------------------------------------------------------------- //

    function createReactionParamsTemplate(elem) {
        var params = '' +
            '<div class="input-field">' +
            '<input id="test" type="text">' +
            '<label for="test">' + elem.name + '</label>' +
            '</div>' +
            '<span>' + elem.description + '</span>'
        return params;
    }

    function executeReaction(elem) {
        let paramsHtml = "";

        reaction.params.forEach(elem =>
            paramsHtml += createReactionParamsTemplate(elem)
        );
        reactionCreator.innerHTML = paramsHtml;
    }

    function setReactionButton(elem) {
        var test = document.getElementById(elem.name);
        test.addEventListener('click', function(){
            executeReaction(elem);
        }, false);
    }

    function createReactionTemplate(elem) {
        var newReaction = '' +
            '<div style="margin: 20px">' +
                '<span class="orange">' + elem.service + '</span><br>' +
                '<span class="orange">' + elem.title + '</span>' +
                '<a id="' + elem.name + '" class="left btn-floating btn waves-effect waves-light orange" style="margin-bottom: 10px"><i class="material-icons">keyboard_arrow_right</i></a><br>' +
                '<span class="orange">' + elem.description + '</span><br>' +
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

    function createActionParamsTemplate(elem) {
        var params = '' +
            '<div class="input-field">' +
                '<input id="test" type="text">' +
                '<label for="test">' + elem.name + '</label>' +
            '</div>' +
            '<span>' + elem.description + '</span>'
        return params;
    }

    function executeAction(action) {
        let paramsHtml = "";

        action.params.forEach(elem =>
            paramsHtml += createActionParamsTemplate(elem)
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
