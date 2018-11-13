var _ = require('lodash');

var breakingBad = {
  name: 'Breaking Bad',
  check: function(pullRequest, shall) {
    if (atLeast80PrecentCommitsFailedBuild(pullRequest)) {

      var achievement = {
        avatar: 'images/achievements/breakingBad.achievement.jpg',
        name: 'Breaking Bad',
        short: [
          'Look, let\'s start with some tough love. ',
          'You two suck at peddling meth. Period.'
        ].join(''),
        description: [
          'You merged a Pull Request with 5 or more commits with failing status'
        ].join(''),
        relatedPullRequest: pullRequest._id
      };

      shall.grant(pullRequest.creator.username, achievement);
    }
  }
};

function atLeast80PrecentCommitsFailedBuild(pullRequest) {
  var failedCommits = 0;
  var totalCommits = pullRequest.commits.length;
  _.forEach(pullRequest.commits, function(commit) {
    var TRAVIS_PR = 'continuous-integration/travis-ci/pr';
    var TRAVIS_PUSH = 'continuous-integration/travis-ci/push';
    var prBuildStatus = commit.statuses[TRAVIS_PR];
    var pushBuildStatus = commit.statuses[TRAVIS_PUSH];
    if ((prBuildStatus && _.isEqual(prBuildStatus.state, 'error')) ||
			(pushBuildStatus && _.isEqual(pushBuildStatus.state, 'error'))) {
      failedCommits++;
    }
  });

  return ((failedCommits / totalCommits) * 100) >= 80;
}

module.exports = breakingBad;
