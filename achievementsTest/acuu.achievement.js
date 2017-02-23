var _ = require('lodash');

var accu = {
  name: 'accu',
  accumulative: true,
  check: function(pullRequest, shall, counter) {
    var creatorCounter = counter[pullRequest.creator.username] || 0;
    if (creatorCounter === 5) {

      var achieve = {
        avatar: 'images/achievements/doubleReview.achievement.gif',
        name: 'ACCUMELATIVE, YO!',
        short: _.escape('"This way!"-"No, that way!"'),
        description: [
          'this is the first accumulative achievement!'
        ].join(''),
        relatedPullRequest: pullRequest.id
      };

      shall.grant(pullRequest.creator.username, achieve);
    } else {
      shall.progress(pullRequest.creator.username, creatorCounter + 1);
    }
  }
};

module.exports = accu;
