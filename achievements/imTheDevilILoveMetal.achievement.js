var imTheDevilILoveMetal = {
	name: 'I\'m the Devil I Love Metal',
	check: function(pullRequest, shall) {
		if (isSequenceOfSixes(pullRequest.number)) {

			var achievement = {
				avatar: 'images/achievements/iAmTheDevilILikeMetal.achievement.gif',
				name: 'I\'m the Devil I Love Metal',
				short: 'check this riff it\'s fucking tasty',
				description: [
					'Your pull request id ' + pullRequest.number,
					' summoned the devil himself',
					'I hope that code you submitted was a masterpiece, ',
					'or you\'re gonna gargle mayonnaise'
					].join(''),
				relatedPullRequest: pullRequest.id
			};

			shall.grant(pullRequest.creator.username, achievement);
		}
	}
};

function isSequenceOfSixes(number) {
	const sequenceOfSixesRegEx = new RegExp(/^6{2,}$/);
	return sequenceOfSixesRegEx.test(number);
}

module.exports = imTheDevilILoveMetal;
