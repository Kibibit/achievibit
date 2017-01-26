var _ = require('lodash');

var neverGoFullRetard = {
	name: 'never go full retard',
	check: function(pullRequest, shall) {
		if (pullRequest.files && pullRequest.files.length > 0 &&
			_.every(pullRequest.files, isAnImage)) {

			var achieve = {
				avatar : 'images/achievements/neverGoFullRetard.achievement.png',
				name : 'never go full retard',
				short : 'Nigga, You Just Went Full Retard',
				description : 'merged a pull request containing only pictures. pretty!',
				relatedPullRequest: pullRequest.id
			};
			shall.grant(pullRequest.creator.username, achieve);
			_.forEach(pullRequest.reviewers, function(reviewer) {
				shall.grant(reviewer.username, achieve);
			});
		}
	}
};

function isAnImage(file) {
	return _.isObject(file) &&
		(_.endsWith(file.name, '.png') ||
			_.endsWith(file.name, '.jpg') ||
			_.endsWith(file.name, '.jpeg') ||
			_.endsWith(file.name, '.ico') ||
			_.endsWith(file.name, '.svg') ||
			_.endsWith(file.name, '.gif') ||
			_.endsWith(file.name, '.icns'));
}

module.exports = neverGoFullRetard;
