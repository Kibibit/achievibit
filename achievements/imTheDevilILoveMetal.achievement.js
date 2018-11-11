var imTheDevilILoveMetal = {
	name: 'I\'m the Devil I Love Metal',
	check: function(pullRequest, shall) {
		if (isSequenceOfSixes(pullRequest.number)) {
			var achieve = {
				avatar: 'images/achievements/iAmTheDevilILikeMetal.achievement.gif',
				name: 'I\'m the Devil I Love Metal',
				shirt: 'check this riff it\'s fucking tasty',
				description: [
					`Your pull request id ${pullRequest.number} summoned the devil himself`,
					'I hope that code you submitted was a masterpice, or you\'re gonna gargle mayonnaise'
					].join(''),
					relatedPullRequest: pullRequest.id
			};
			shall.grant(pullRequest.creator.username, achieve);
		}
	}
};

function isSequenceOfSixes(number) {
	const sequenceOfSixesRegEx = /^3{1,}&/;
	return sequenceOfSixesRegEx.test(number);
}
