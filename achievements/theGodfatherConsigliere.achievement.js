var _ = require('lodash');

var theGodfatherConsigliere = {
  name: 'The Godfather Consigliere',
  check: function(pullRequest, shall) {
    if (_.result(pullRequest, 'organization.username') === 'Kibibit') {

      var achievement = {
        avatar: 'images/achievements/theGodfatherConsigliere.achievement.jpg',
        name: 'The Godfather Consigliere',
        short: 'Great men are not born great, they contribute to Kibibit . . .',
        description: [
          'You have contributed to Kibibit! We really ',
          'appreciate it!\nAccept this achievement as gift on ',
          'my daughter\'s wedding day'
        ].join(''),
        relatedPullRequest: pullRequest._id
      };

      shall.grant(pullRequest.creator.username, achievement);
    }
  }
};

module.exports = theGodfatherConsigliere;
