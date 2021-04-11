var drClaw =
  require('../achievements/drClaw.achievement');
var expect    = require('chai').expect;

var MESSAGE_INCREASED = [
  '[![Coverage Status](https://coveralls.io/builds/10085689/badge)]',
  '(https://coveralls.io/builds/10085689)\n\nCoverage increased (+2.6%) to ',
  '39.32% when pulling **c07c2c6c1d5043fe4e916625ab3c537ca6d1b966 on ',
  'achievement-dont-yell-at-me** into ',
  '**ed92c7d04925ad4b4972c69b45daea5c595eb2a9 on master**.'
].join('');

var MESSAGE_NOT_ENOUGH_DECREASED = [
  '[![Coverage Status](https://coveralls.io/builds/10085689/badge)]',
  '(https://coveralls.io/builds/10085689)\n\nCoverage decreased (-1.6%) to ',
  '39.32% when pulling **c07c2c6c1d5043fe4e916625ab3c537ca6d1b966 on ',
  'achievement-dont-yell-at-me** into ',
  '**ed92c7d04925ad4b4972c69b45daea5c595eb2a9 on master**.'
].join('');

var MESSAGE_DECREASED = [
  '[![Coverage Status](https://coveralls.io/builds/10076567/badge)]',
  '(https://coveralls.io/builds/10076567)\n\nCoverage decreased (-6.2%) to ',
  '31.285% when pulling **f63b4b15d94e67fbd37f58342d9899390ea05224 on ',
  'fix-port** into **e3ad341b991dc9bac57f50fc87a15113b7e62735 on master**.'
].join('');

var MESSAGE_DECREASED_EVEN_MORE = [
  '[![Coverage Status](https://coveralls.io/builds/10085689/badge)]',
  '(https://coveralls.io/builds/10085689)\n\nCoverage decreased (-10.6%) to ',
  '39.32% when pulling **c07c2c6c1d5043fe4e916625ab3c537ca6d1b966 on ',
  'achievement-dont-yell-at-me** into ',
  '**ed92c7d04925ad4b4972c69b45daea5c595eb2a9 on master**.'
].join('');


describe('drClaw achievement', function() {
  it('should not be granted if comments undefined', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    drClaw.check(pullRequest, testShall);
    expect(testShall.grantedToUsername).to.not.exist;
    expect(testShall.grantedAchievement).to.not.exist;
  });

  it('should not be granted if no comments', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    pullRequest.comments = [];

    drClaw.check(pullRequest, testShall);
    expect(testShall.grantedToUsername).to.not.exist;
    expect(testShall.grantedAchievement).to.not.exist;
  });

  it('should not be granted if no coverall comments', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    pullRequest.comments = [];
    // same comment by a user that is not 'coverall'
    pullRequest.comments
      .push(createComment('inspector gadget', MESSAGE_DECREASED));

    drClaw.check(pullRequest, testShall);
    expect(testShall.grantedToUsername).to.not.exist;
    expect(testShall.grantedAchievement).to.not.exist;
  });

  it('should not be granted if coverage increased', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    pullRequest.comments = [];
    pullRequest.comments
      .push(createComment('coveralls', MESSAGE_INCREASED));

    drClaw.check(pullRequest, testShall);
    expect(testShall.grantedToUsername).to.not.exist;
    expect(testShall.grantedAchievement).to.not.exist;
  });

  it('should not be granted if percentage lower than 2', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    pullRequest.comments = [];
    pullRequest.comments
      .push(createComment('coveralls', MESSAGE_NOT_ENOUGH_DECREASED));

    drClaw.check(pullRequest, testShall);
    expect(testShall.grantedToUsername).to.not.exist;
    expect(testShall.grantedAchievement).to.not.exist;
  });

  it('should be granted to PR creator if coverage decreased by 2+', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    pullRequest.comments = [];
    pullRequest.comments
      .push(createComment('coveralls', MESSAGE_DECREASED));

    drClaw.check(pullRequest, testShall);
    expect(testShall.grantedToUsername).to.be.a('string');
    expect(testShall.grantedToUsername).to.equal('creator');
    expect(testShall.grantedAchievement).to.be.an('object');
  });

  it('should parse only last coverall comment', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    pullRequest.comments = [];
    pullRequest.comments
      .push(createComment('coveralls', MESSAGE_INCREASED));
    pullRequest.comments
      .push(createComment('coveralls', MESSAGE_DECREASED));

    drClaw.check(pullRequest, testShall);
    expect(testShall.grantedToUsername).to.be.a('string');
    expect(testShall.grantedToUsername).to.equal('creator');
    expect(testShall.grantedAchievement).to.be.an('object');
  });

  it('should write in description last decreased percentage', function() {
    var testShallBiggerLast = new Shall();
    var testShallBiggerFirst = new Shall();
    var pullRequestBiggerLast = new PullRequest();
    var pullRequestBiggerFirst = new PullRequest();

    pullRequestBiggerLast.comments = [];
    pullRequestBiggerLast.comments
      .push(createComment('coveralls', MESSAGE_DECREASED));
    pullRequestBiggerLast.comments
      .push(createComment('coveralls', MESSAGE_DECREASED_EVEN_MORE));

    pullRequestBiggerFirst.comments = [];
    pullRequestBiggerFirst.comments
      .push(createComment('coveralls', MESSAGE_DECREASED_EVEN_MORE));
    pullRequestBiggerFirst.comments
      .push(createComment('coveralls', MESSAGE_DECREASED));

    drClaw.check(pullRequestBiggerLast, testShallBiggerLast);
    expect(testShallBiggerLast.grantedToUsername).to.be.a('string');
    expect(testShallBiggerLast.grantedToUsername).to.equal('creator');
    expect(testShallBiggerLast.grantedAchievement).to.be.an('object');
    expect(testShallBiggerLast.grantedAchievement.description)
      .to.have.string('-10.6');

    drClaw.check(pullRequestBiggerFirst, testShallBiggerFirst);
    expect(testShallBiggerFirst.grantedToUsername).to.be.a('string');
    expect(testShallBiggerFirst.grantedToUsername).to.equal('creator');
    expect(testShallBiggerFirst.grantedAchievement).to.be.an('object');
    expect(testShallBiggerFirst.grantedAchievement.description)
      .to.have.string('-6.2');
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
