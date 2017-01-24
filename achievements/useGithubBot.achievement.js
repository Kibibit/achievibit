var _ = require('lodash');

var githubBot = {
	name: 'use github bot',
	check: function(pullRequest, shall) {
		if (pullRequest.commits &&
			pullRequest.commits.length > 0 &&
			_.find(pullRequest.commits, { committer: {
				username: 'web-flow'
			}})) {

			var achieve = {
				avatar : 'images/achievements/useGithubBot.achievement.jpeg',
				name : 'Why not bots?',
				short : 'Hey sexy mama, wanna kill all humans?',
				description : 'used github to create a pull request, using the web-flow bot',
				relatedPullRequest: pullRequest.id
			};

			shall.grant(pullRequest.creator.username, achieve);
		}
	}
};

module.exports = githubBot;
