var _ = require('lodash');

var breakingBad = {
	name: 'I\'m Mr. Meeseeks! Look at me!',
	check: function(pullRequest, shall) {
		if (checkIfResolvesManyIssues(pullRequest)) {

			var achievement = {
				avatar : 'https://i1.sndcdn.com/artworks-000073839997-26zhb5-t500x500.jpg',
				name: 'I\'m Mr. Meeseeks! Look at me!',
				short: 'Knock yourselves out. Just eh-keep your requests simple.',
				description: 'Congrats on resolving so many issues at ones! Shouldn\'t pull requests be kept simple? Pull requests don\'t usually have to exist this long. It\'s getting weird.',
				relatedPullRequest: pullRequest._id
			};

			shall.grant(pullRequest.creator.username, achievement);
		}
	}
};

function checkIfResolvesManyIssues(pullRequest) {
	var desc = pullRequest.description;
	//these keywords resolve issues in github
	var resolveIssueRegex = /(close|closes|closed|fix|fixes|fixed|resolve|resolves|resolved) \#(\d+)/g;
	var result = desc.match(resolveIssueRegex);

//resolved more than 3 issue in on pull request
	return result.length > 3;
	}

module.exports = breakingBad;
