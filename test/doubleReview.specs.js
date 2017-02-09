var doubleReview =
  require('../achievements/doubleReview.achievement');
var expect    = require('chai').expect;

describe('doubleReview achievement', function() {
  it('should not be granted if 1 reviewer', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    doubleReview.check(pullRequest, testShall);
    expect(testShall.grantedAchievements.reviewer).to.not.exist;
    expect(testShall.grantedAchievements.creator).to.not.exist;
  });

  it('should not be granted if more than 2 reviewers', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    pullRequest.reviewers.push({
      username: 'reviewerTwo'
    });

    pullRequest.reviewers.push({
      username: 'reviewerThree'
    });

    doubleReview.check(pullRequest, testShall);
    expect(testShall.grantedAchievements.reviewer).to.not.exist;
    expect(testShall.grantedAchievements.reviewerTwo).to.not.exist;
    expect(testShall.grantedAchievements.reviewerThree).to.not.exist;
  });

  it('should not be granted if 2 reviewers including creator', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    pullRequest.reviewers.push({
      username: 'creator'
    });

    doubleReview.check(pullRequest, testShall);
    expect(testShall.grantedAchievements.reviewer).to.not.exist;
    expect(testShall.grantedAchievements.creator).to.not.exist;
  });

  it('should be granted if 2 reviewers excluding creator', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    pullRequest.reviewers.push({
      username: 'reviewerTwo'
    });

    doubleReview.check(pullRequest, testShall);
    expect(testShall.grantedAchievements.creator).to.not.exist;
    expect(testShall.grantedAchievements.reviewer).to.exist;
    expect(testShall.grantedAchievements.reviewer).to.be.an('object');
    expect(testShall.grantedAchievements.reviewerTwo).to.exist;
    expect(testShall.grantedAchievements.reviewerTwo).to.be.an('object');
  });
});

function Shall() {
  var self = this;

  self.grantedAchievements = {};

  self.grant = function(username, achievementObject) {
    self.grantedAchievements[username] = achievementObject;
  };
}

function PullRequest() {
  return {
    'id': 'test',
    'url': 'url',
    'creator': {
      'username': 'creator'
    },
    'reviewers': [ {
      'username': 'reviewer'
    } ]
  };
}
