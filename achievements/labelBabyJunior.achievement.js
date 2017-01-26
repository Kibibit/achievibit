var console = process.console;

var labelBabyJunior = {
	name: 'Label Baby Junior',
	check: function(pullRequest, shall) {
		console.log("checking if many labels...\n");
		if (checkIfManyLabels(pullRequest))  {
			console.log("I have many labels!!!\n");
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
		console.log("I'm inside checkIfManyLabels" + labels.length);
		return labels && labels.length > 3;
	}
	console.log("Something is wrong. Labels is undefined");
	return false;
	}

module.exports = labelBabyJunior;
