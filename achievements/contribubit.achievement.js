var _ = require('lodash');
var console = process.console;

var TheGodfatherConsigliere = {
	name: 'TheGodfatherConsigliere',
	check: function(pullRequest, shall) {
		if (contributedToKibibit(pullRequest)) {
			//console.log("TheDunaevsky owns this...");
			var achievement = {
				avatar : 'https://worldfilmgeek.files.wordpress.com/2016/12/thegodfatherstill.jpg',
				name: 'The Godfather Consigliere',
				short: 'Great men are not born great, they contribute to Kibibit . . . ',
				description: 'You have contributed to a Kibibit repository. Accept this achievement as gift on my daughter\'s wedding day',
				relatedPullRequest: pullRequest._id
			};

			shall.grant(pullRequest.creator.username, achievement);
		}
	}
};

function contributedToKibibit(pullRequest){
	var organizationName = pullRequest.organization.username;
	if ( typeof organizationName !== 'undefined'){
		return organizationName === "Kibibit";
	} else {
		return false;
	}


}

module.exports = TheGodfatherConsigliere;
