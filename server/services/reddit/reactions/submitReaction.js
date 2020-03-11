const fetch = require('node-fetch');

module.exports = {

	submitReactionCheck: function (json) {
		const title = global.getParam(json.reaction.params, "title");
		const text = global.getParam(json.reaction.params, "text");
		const sr = global.getParam(json.reaction.params, "subReddit");

		if (!(title && text && sr))
			return "Missing the title, text or the subreddit";
		return null;
	},

	submitReaction: async function (area) {
		let title = global.getParam(area.reaction.params, "title");
		let text = global.getParam(area.reaction.params, "text");
		let sr = global.getParam(area.reaction.params, "subReddit");
		let kind = 'self';
		let token = await global.findInDbAsync(
			global.CollectionToken, {
				user_id: area.user_id,
				service: global.Services.Reddit
			}
		);

		fetch(generalSettings.redditAuthApi
			+ `/api/submit`
			+ `?title=${title}`
			+ `&sr=${sr}`
			+ `&text=${text}`
			+ `&kind=${kind}`,
			{
				'method': 'POST',
				headers : {
					'Authorization' : `bearer ${token.access_token}`
				}
			}
		)
		.catch((error) => {
			return 'An error occured on reddit post subreddit';
		});
	}
};
