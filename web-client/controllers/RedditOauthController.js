document.addEventListener('DOMContentLoaded', function () {
	var authenticateReddit = document.getElementById('authenticate-reddit');

	console.log("Adding event listener");
	authenticateReddit.addEventListener('href', generateCodeUrl);
});
