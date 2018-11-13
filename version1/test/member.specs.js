var member =
  require('../achievements/member.achievement');
var expect    = require('chai').expect;
var moment = require('moment');

describe('member achievement', function() {
  it('should not be granted if PR opened less than 2 weeks ago', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    pullRequest.createdOn = moment().subtract(13, 'days').toDate();

    member.check(pullRequest, testShall);
    expect(testShall.grantedToUsername).to.not.exist;
    expect(testShall.grantedAchievement).to.not.exist;
  });

  it('should be granted if PR opened more than 2 weeks ago', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    pullRequest.createdOn = moment().subtract(15, 'days').toDate();

    member.check(pullRequest, testShall);
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
