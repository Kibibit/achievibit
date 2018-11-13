var useGithubBot = require('../achievements/useGithubBot.achievement');
var expect    = require('chai').expect;

describe('useGithubBot achievement', function() {
  it('should be granted if committer is username is web-flow', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();
    useGithubBot.check(pullRequest, testShall);
    expect(testShall.grantedToUsername).to.be.a('string');
    expect(testShall.grantedToUsername).to.equal('creator');
    expect(testShall.grantedAchievement).to.be.an('object');
  });

  it('should not grant if committer is not web-flow', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    pullRequest.commits[0].committer.username = 'not-web-flow';

    useGithubBot.check(pullRequest, testShall);
    expect(testShall.grantedToUsername).to.not.exist;
    expect(testShall.grantedAchievement).to.not.exist;
  });

  it('should grant to the pull request author (???)', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();
    useGithubBot.check(pullRequest, testShall);
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
    'number': 3,
    'creator': {
      'username': 'creator'
    },
    'commits': [
      {
        'author': {
          'username': 'commit-author'
        },
        'committer': {
          'username': 'web-flow'
        }
      }
    ]
  };
}
