var jwt = require('jsonwebtoken');

exports.redirectToService = function(req, res)
{
	let json = {
		user_id: req.body.user_id,
		service : req.params.service,
		support : req.device.type.toUpperCase() == 'PHONE' ? 'mobile' : 'web'
	};

	let token = jwt.sign(json, global.secret, {
		expiresIn : '2m'
	});
	if (global.ServiceGenerateUrlMap.get(req.params.service))
		res.redirect(global.ServiceGenerateUrlMap.get(req.params.service)(token));
	else
		res.redirect('https://theuselessweb.com/');
}

exports.getTokenFromService = function(req, res)
{
	let token = getToken(req);
	if (!token || !token.service || !token.user_id || !token.support || !global.ServiceRedirectAuthMap.get(token.service))
		res.redirect('https://theuselessweb.com/');
	else {
		let json = {
			user_id : token.user_id,
			service : token.service
		};
		global.ServiceRedirectAuthMap.get(token.service, token.user_id)(req, json);
		redirectToClient(res, token.support);
	}
}

function getToken(req)
{
	let token;
	if (req.query.state)
		token = req.query.state;
	else if (req.params.token)
		token = req.params.token;
	if (!token)
		return null;
	return jwt.verify(token, global.secret);
}

function redirectToClient(res, support)
{
	if (support == 'mobile')
		res.redirect('intent://my_host#Intent;scheme=my_scheme;action=my_action;end');
	else if (support == 'web')
		res.redirect('http://localhost:8081/profil');
	else
		res.redirect('https://theuselessweb.com/');
}

exports.deleteService = async function(req, res)
{
	let json = await global.deleteInDbAsync(global.CollectionToken, {user_id : req.body.user_id, service : req.params.service});
	if (json.deletedCount == 1)
		res.send();
	global.responseError(res, 403, 'The service is not connected to you\'r account');
}
