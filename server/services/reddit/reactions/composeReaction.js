const fetch = require('node-fetch');

module.exports = {

	composeReactionCheck: function (json) {
		let to = global.getParam(json.reaction.params, "to");
		let subject = global.getParam(json.reaction.params, "subject");
		let text = global.getParam(json.reaction.params, "text");

		if (!(to && subject && text))
			return "Missing the title, text or the user";
		return null;
	},

	composeReaction: async function (area) {
		let to = global.getParam(area.reaction.params, "to");
		let subject = global.getParam(area.reaction.params, "subject");
		let text = global.getParam(area.reaction.params, "text");
		let token = await global.findInDbAsync(
			global.CollectionToken, {
				user_id: area.user_id,
				service: global.Services.Reddit
			}
		);
		fetch(generalSettings.redditAuthApi
			+ `/api/compose`
			+ `?to=${to}`
			+ `&subject=${subject}`
			+ `&text=${text}`,
			{
				'method': 'POST',
				headers : {
					'Authorization' : `bearer ${token.access_token}`
				}
			}
		)
		.catch((error) => {
			return 'An error occurred on Reddit'
		});
	}

};
