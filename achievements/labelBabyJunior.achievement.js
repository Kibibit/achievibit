

var labelBabyJunior = {
	name: 'Label Baby Junior',
	check: function(pullRequest, shall) {

		if (checkIfManyLabels(pullRequest))  {

			var achievement = {
				avatar : 'images/achievements/theLabelMaker.achievment.jpg',
				name: 'The Label Maker',
				short: 'Is this a label maker?',
				description: 'You\'ve put many labels, thank you for organizng. You\'re a gift that keeps on re-giving' ,
				relatedPullRequest: pullRequest._id
			};

			shall.grant(pullRequest.creator.username, achievement);
		}
	}
};

function checkIfManyLabels(pullRequest) {
	var labels = pullRequest.labels;
	if(labels){
		return labels.length > 3;
	}
	return false;
	}

module.exports = labelBabyJunior;
