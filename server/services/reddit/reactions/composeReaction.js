module.exports = {

	composeReactionCheck: function (json) {
		const to = global.getParam(json.reaction.params, "to");
		const subject = global.getParam(json.reaction.params, "subject");
		const text = global.getParam(json.reaction.params, "text");

		if (!(to && subject && text))
			return "Missing the title, text or the subreddit";
		return null;
	},

	composeReaction: async function (RedditAuthApi, area, res) {
		const to = global.getParam(area.reaction.params, "to");
		const subject = global.getParam(area.reaction.params, "subject");
		const text = global.getParam(area.reaction.params, "text");
		const token = await global.findInDbAsync(
			global.CollectionToken, {
				user_id: area.user_id,
				service: global.Services.Reddit
			}
		);

		RedditAuthApi
			.post(`/api/compose?to=${to}&subject=${subject}&text=${text}`,
				{},
				{
					headers: {
						Authorization: `bearer ${token.access_token}`
					}
				}
			)
			.catch((error) => {
				return 'An error occurred on Reddit'
			});
	}
};
