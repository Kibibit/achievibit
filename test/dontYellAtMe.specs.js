var dontYellAtMe =
  require('../achievements/dontYellAtMe.achievement');
var expect    = require('chai').expect;

var ALL_CAPS_REASON = 'ALL CAPS';
var EXCLAMATION_REASON = '3 or more exclamation marks';
var MIXED_REASONS = ALL_CAPS_REASON + ' and ' + EXCLAMATION_REASON;


describe('dontYellAtMe achievement', function() {
  it('should not be granted if all letters are lowercase', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    dontYellAtMe.check(pullRequest, testShall);
    expect(testShall.grantedToUsername).to.not.exist;
    expect(testShall.grantedAchievement).to.not.exist;
  });

  it('should not be granted if title is empty', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    pullRequest.title = '';

    dontYellAtMe.check(pullRequest, testShall);
    expect(testShall.grantedToUsername).to.not.exist;
    expect(testShall.grantedAchievement).to.not.exist;
  });

  it('should not be granted if letters are mixed case', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    pullRequest.title = 'Title';

    dontYellAtMe.check(pullRequest, testShall);
    expect(testShall.grantedToUsername).to.not.exist;
    expect(testShall.grantedAchievement).to.not.exist;
  });

  it('should not be granted if there are less than 3 \'!\'', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    pullRequest.title = 'title!!';

    dontYellAtMe.check(pullRequest, testShall);
    expect(testShall.grantedToUsername).to.not.exist;
    expect(testShall.grantedAchievement).to.not.exist;
  });

  it('should not be granted if all caps only in tags', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    pullRequest.title = '[FOO]';

    dontYellAtMe.check(pullRequest, testShall);
    expect(testShall.grantedToUsername).to.not.exist;
    expect(testShall.grantedAchievement).to.not.exist;
  });

  it('should not be granted if title does not contain letters', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    pullRequest.title = '#42';

    dontYellAtMe.check(pullRequest, testShall);
    expect(testShall.grantedToUsername).to.not.exist;
    expect(testShall.grantedAchievement).to.not.exist;
  });

  it('should be granted to PR creator if title is all caps', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    pullRequest.title = 'FOO';

    dontYellAtMe.check(pullRequest, testShall);
    expect(testShall.grantedToUsername).to.be.a('string');
    expect(testShall.grantedToUsername).to.equal('creator');
    expect(testShall.grantedAchievement).to.be.an('object');
    expect(testShall.grantedAchievement.description)
      .to.have.string(ALL_CAPS_REASON);
  });

  it('should be granted to PR creator if more than 2 \'!\'', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    pullRequest.title = 'foo!!!';

    dontYellAtMe.check(pullRequest, testShall);
    expect(testShall.grantedToUsername).to.be.a('string');
    expect(testShall.grantedToUsername).to.equal('creator');
    expect(testShall.grantedAchievement).to.be.an('object');
    expect(testShall.grantedAchievement.description)
      .to.have.string(EXCLAMATION_REASON);
  });

  it('should be granted to PR creator if both reasons', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    pullRequest.title = 'FOO!!!';

    dontYellAtMe.check(pullRequest, testShall);
    expect(testShall.grantedToUsername).to.be.a('string');
    expect(testShall.grantedToUsername).to.equal('creator');
    expect(testShall.grantedAchievement).to.be.an('object');
    expect(testShall.grantedAchievement.description)
      .to.have.string(MIXED_REASONS);
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
