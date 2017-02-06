var theGodfatherConsigliere = require('../achievements/theGodfatherConsigliere.achievement');
var expect    = require('chai').expect;

describe('theGodfatherConsigliere achievement', function() {
  it('should be granted to PR creator if organization is Kibibit', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    var organization = {
      'username': 'Kibibit'
    };

    pullRequest.organization = organization;

    theGodfatherConsigliere.check(pullRequest, testShall);
    expect(testShall.grantedToUsername).to.be.a('string');
    expect(testShall.grantedToUsername).to.equal('creator');
    expect(testShall.grantedAchievement).to.be.an('object');
  });

  it('should not grant if no organization', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    theGodfatherConsigliere.check(pullRequest, testShall);
    expect(testShall.grantedToUsername).to.not.exist;
    expect(testShall.grantedAchievement).to.not.exist;
  });

  it('should not grant if organization is not Kibibit', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    var organization = {
      'username': 'Gibibit'
    };

    pullRequest.organization = organization;

    theGodfatherConsigliere.check(pullRequest, testShall);
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
    'number': 3,
    'creator': {
      'username': 'creator'
    }
  };
}
