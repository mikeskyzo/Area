module.exports = {

	composeReactionCheck: function (json) {
		let to = global.getParam(json.reaction.params, "to");
		let subject = global.getParam(json.reaction.params, "subject");
		let text = global.getParam(json.reaction.params, "text");

		if (!(to && subject && text))
			return "The required datas aren't all here.";
		return null;
	},

	composeReaction: function (RedditAuthApi, area, res) {
		let to = global.getParam(json.reaction.params, "to");
		let subject = global.getParam(json.reaction.params, "subject");
		let text = global.getParam(json.reaction.params, "text");
		let token = await global.findInDbAsync(
			global.CollectionToken, {
				user_id: area.user_id,
				service: global.Services.Reddit
			}
		);

		RedditAuthApi
			.post(`/api/compose` +
				`?to=${to}` +
				`&text=${text}` +
				`&sr=${sr}` +
				{}, {
					headers: {
						Authorization: `bearer ${token.access_token}`
					}
				}
			)
			.then (function (response){
				res.send();
			})
			.catch((error) => {
				console.log(error);
				global.responseError(res, 401, 'An error occured ');
			});
	}

};
