module.exports = {

	friendReactionCheck: function (json) {
		let name = global.getParam(json.reaction.params, "name");

		if (!(name))
			return "The required datas aren't all here.";
		return null;
	},

	friendReaction: async function (RedditAuthApi, area, res) {
		let name = global.getParam(area.reaction.params, "name");
		let token = await global.findInDbAsync(
			global.CollectionToken, {
				user_id: area.user_id,
				service: global.Services.Reddit
			}
		);

		RedditAuthApi
			.post(`/api/friend` +
				`?name=${name}` +
				{}, {}, {
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
				global.sendResponse(res, 401, 'An error occured ');
			});
	}

};
