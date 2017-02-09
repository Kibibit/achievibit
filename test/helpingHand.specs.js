var helpingHand =
  require('../achievements/helpingHand.achievement');
var expect    = require('chai').expect;

describe('helpingHand achievement', function() {
  it('should not be granted if PR creator is the only committer', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    helpingHand.check(pullRequest, testShall);
    expect(testShall.grantedToUsername).to.not.exist;
    expect(testShall.grantedAchievement).to.not.exist;
  });

  it('should not be granted if PR creator is also the reviewer', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    pullRequest.reviewers[0].username = 'creator';

    helpingHand.check(pullRequest, testShall);
    expect(testShall.grantedToUsername).to.not.exist;
    expect(testShall.grantedAchievement).to.not.exist;
  });

  it('should not be granted if random committer', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    pullRequest.commits.push({
      'author': {
        'username': 'k1bib0t',
      }
    });

    helpingHand.check(pullRequest, testShall);
    expect(testShall.grantedToUsername).to.not.exist;
    expect(testShall.grantedAchievement).to.not.exist;
  });

  it('should be granted if PR reviewer added commit', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    pullRequest.commits.push({
      'author': {
        'username': 'reviewer',
      }
    });

    helpingHand.check(pullRequest, testShall);
    expect(testShall.grantedAchievements.creator).to.exist;
    expect(testShall.grantedAchievements.creator).to.be.an('object');
    expect(testShall.grantedAchievements.reviewer).to.exist;
    expect(testShall.grantedAchievements.reviewer).to.be.an('object');
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
    } ],
    'commits': [
      {
        'author': {
          'username': 'creator',
        }
      },
      {
        'author': {
          'username': 'creator',
        }
      }
    ]
  };
}
