var _ = require('lodash');

var cuttingEdge = {
  name: 'Cutting Edges',
  check: function(pullRequest, shall) {
    if (pullRequest.merged) {
      const anyApprovals = _.some(pullRequest.reviews, function(review) {
        return review.state === 'APPROVED';
      });

      if (!anyApprovals) {
        var achieve = {
          avatar: 'images/achievements/cuttingEdges.achievement.jpg',
          name: 'Cutting Edges',
          short: 'Cutting corners? I also like to live dangerously',
          description: 'You\'ve merged a pull request without a reviewer confirming',
          relatedPullRequest: pullRequest.id
        };

        shall.grant(pullRequest.creator.username, achieve);
      }
    }
  }
};

module.exports = cuttingEdge;
