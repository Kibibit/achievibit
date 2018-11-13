var mrMiyagi =
  require('../achievements/mrMiyagi.achievement');
var expect    = require('chai').expect;

var MESSAGE_INCREASED_BELOW_100 = [
  '[![Coverage Status](https://coveralls.io/builds/10085689/badge)]',
  '(https://coveralls.io/builds/10085689)\n\nCoverage increased (+2.6%) to ',
  '99.99% when pulling **c07c2c6c1d5043fe4e916625ab3c537ca6d1b966 on ',
  'achievement-dont-yell-at-me** into ',
  '**ed92c7d04925ad4b4972c69b45daea5c595eb2a9 on master**.'
].join('');

var MESSAGE_INCREASED_TO_100 = [
  '[![Coverage Status](https://coveralls.io/builds/10085689/badge)]',
  '(https://coveralls.io/builds/10085689)\n\nCoverage increased (+2.6%) to ',
  '100.0% when pulling **c07c2c6c1d5043fe4e916625ab3c537ca6d1b966 on ',
  'achievement-dont-yell-at-me** into ',
  '**ed92c7d04925ad4b4972c69b45daea5c595eb2a9 on master**.'
].join('');


describe('mrMiyagi achievement', function() {
  it('should not be granted if comments undefined', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    mrMiyagi.check(pullRequest, testShall);
    expect(testShall.grantedToUsername).to.not.exist;
    expect(testShall.grantedAchievement).to.not.exist;
  });

  it('should not be granted if no comments', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    pullRequest.comments = [];

    mrMiyagi.check(pullRequest, testShall);
    expect(testShall.grantedToUsername).to.not.exist;
    expect(testShall.grantedAchievement).to.not.exist;
  });

  it('should not be granted if no coverall comments', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    pullRequest.comments = [];
    pullRequest.comments
      .push(createComment('mrMiyagi', MESSAGE_INCREASED_TO_100));

    mrMiyagi.check(pullRequest, testShall);
    expect(testShall.grantedToUsername).to.not.exist;
    expect(testShall.grantedAchievement).to.not.exist;
  });

  it('should not be granted if coverage increased below 100%', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    pullRequest.comments = [];
    pullRequest.comments
      .push(createComment('coveralls', MESSAGE_INCREASED_BELOW_100));

    mrMiyagi.check(pullRequest, testShall);
    expect(testShall.grantedToUsername).to.not.exist;
    expect(testShall.grantedAchievement).to.not.exist;
  });

  it('should be granted to PR creator if coverage increased to 100%',
    function() {
      var testShall = new Shall();
      var pullRequest = new PullRequest();

      pullRequest.comments = [];
      pullRequest.comments
        .push(createComment('coveralls', MESSAGE_INCREASED_TO_100));

      mrMiyagi.check(pullRequest, testShall);
      expect(testShall.grantedToUsername).to.be.a('string');
      expect(testShall.grantedToUsername).to.equal('creator');
      expect(testShall.grantedAchievement).to.be.an('object');
    }
  );

  it('should write in description the PR creator username', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    pullRequest.comments = [];
    pullRequest.comments
      .push(createComment('coveralls', MESSAGE_INCREASED_TO_100));

    mrMiyagi.check(pullRequest, testShall);
    expect(testShall.grantedAchievement.description)
      .to.have.string(pullRequest.creator.username + '-san');
  });


});

function createComment(username, message) {
  return {
    'author': {
      'username': username
    },
    'message': message
  };
}

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
