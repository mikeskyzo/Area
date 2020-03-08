module.exports = {

	submitReactionCheck: function (json) {
		let title = global.getParam(json.reaction.params, "title");
		let text = global.getParam(json.reaction.params, "text");
		let sr = global.getParam(json.reaction.params, "subReddit");

		if (!(title && text && sr))
			return "Missing the title of the subreddit";
		return null;
	},

	submitReaction: async function (RedditAuthApi, area, res) {
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

		RedditAuthApi
			.post(`/api/submit` +
				`?title=${title}` +
				`&text=${text}` +
				`&sr=${sr}` +
				`&kind=${kind}`,
				{}, {
					headers: {
						Authorization: `bearer ${token.access_token}`
					}
				}
			)
			.then ((response) => {
				res.send();
			})
			.catch((error) => {
				console.log(error);
				global.sendResponse(res, 401, 'An error occured ');
			});
	}

};
