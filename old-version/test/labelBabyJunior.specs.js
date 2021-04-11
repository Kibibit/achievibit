var labelBabyJunior =
  require('../achievements/labelBabyJunior.achievement');
var expect    = require('chai').expect;
var _ = require('lodash');

describe('labelBabyJunior achievement', function() {
  it('should not be granted if PR labels are undefined', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    labelBabyJunior.check(pullRequest, testShall);
    expect(testShall.grantedToUsername).to.not.exist;
    expect(testShall.grantedAchievement).to.not.exist;
  });

  it('should not be granted if PR has no labels', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    pullRequest.labels = [];

    labelBabyJunior.check(pullRequest, testShall);
    expect(testShall.grantedToUsername).to.not.exist;
    expect(testShall.grantedAchievement).to.not.exist;
  });

  it('should not be granted if less than 6 labels', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    pullRequest.labels = [
      'label1',
      'label2',
      'label3',
      'label4',
      'label5'
    ];

    labelBabyJunior.check(pullRequest, testShall);
    expect(testShall.grantedToUsername).to.not.exist;
    expect(testShall.grantedAchievement).to.not.exist;
  });

  it('should be granted to PR creator if more than 5 labels', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    pullRequest.labels = [
      'label1',
      'label2',
      'label3',
      'label4',
      'label5',
      'label6'
    ];

    labelBabyJunior.check(pullRequest, testShall);
    expect(testShall.grantedToUsername).to.be.a('string');
    expect(testShall.grantedToUsername).to.equal('creator');
    expect(testShall.grantedAchievement).to.be.an('object');
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
