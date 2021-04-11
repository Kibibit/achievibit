var optimusPrime = require('../achievements/optimusPrime.achievement');
var expect    = require('chai').expect;

describe('optimusPrime achievement', function() {
  it('should be granted to PR creator if PR number is prime', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    pullRequest.number = 3;

    optimusPrime.check(pullRequest, testShall);
    expect(testShall.grantedToUsername).to.be.a('string');
    expect(testShall.grantedToUsername).to.equal('creator');
    expect(testShall.grantedAchievement).to.be.an('object');
  });

  it('should not grant if PR number is 1', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    pullRequest.number = 1;

    optimusPrime.check(pullRequest, testShall);
    expect(testShall.grantedToUsername).to.not.exist;
    expect(testShall.grantedAchievement).to.not.exist;
  });

  it('should not grant if PR number is not prime', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    pullRequest.number = 40;

    optimusPrime.check(pullRequest, testShall);
    expect(testShall.grantedToUsername).to.not.exist;
    expect(testShall.grantedAchievement).to.not.exist;
  });

  it('should not fail if PR number does not exist', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    optimusPrime.check(pullRequest, testShall);
    expect(testShall.grantedToUsername).to.not.exist;
    expect(testShall.grantedAchievement).to.not.exist;
  });
});

function Shall() {
  var self = this;

  self.grantedAchievement = undefined;
  self.grantedToUsername = undefined;

  self.grant = function(username, achievementObject) {
    self.grantedToUsername = username;
    self.grantedAchievement = achievementObject;
  };
}

function PullRequest() {
  return {
    'id': 'test',
    'url': 'url',
    'creator': {
      'username': 'creator'
    }
  };
}
