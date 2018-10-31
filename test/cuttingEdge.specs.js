var cuttingEdge =
  require('../achievements/cuttingEdge.achievement');
var expect    = require('chai').expect;

describe('Cutting Edge achievement', function() {
  it('should not be granted if pull request is not merged', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    cuttingEdge.check(pullRequest, testShall);
    expect(testShall.grantedToUsername).to.not.exist;
    expect(testShall.grantedAchievement).to.not.exist;
  });

  it('should not be granted if pull request was merged with approvals', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    pullRequest.merged = true;
    pullRequest.reviews = [
      {
        id: 'review',
        state: 'APPROVED',
      }
    ];

    cuttingEdge.check(pullRequest, testShall);
    expect(testShall.grantedToUsername).to.not.exist;
    expect(testShall.grantedAchievement).to.not.exist;
  });

  it('should be granted if pull request was merged without approvals', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    pullRequest.merged = true;
    pullRequest.reviews = [];

    cuttingEdge.check(pullRequest, testShall);
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
    'title': 'this is a happy little title',
    'id': 'test',
    'url': 'url',
    'description': '',
    'creator': {
      'username': 'creator'
    }
  };
}
