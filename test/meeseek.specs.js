var meeseek =
  require('../achievements/meeseek.achievement');
var expect    = require('chai').expect;

describe('meeseek achievement', function() {
  it('should not be granted if no issues resolved', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    meeseek.check(pullRequest, testShall);
    expect(testShall.grantedToUsername).to.not.exist;
    expect(testShall.grantedAchievement).to.not.exist;
  });

  it('should not be granted if 1 issues resolved', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    pullRequest.description = [
      '[resolves #1]'
    ].join('\n');

    meeseek.check(pullRequest, testShall);
    expect(testShall.grantedToUsername).to.not.exist;
    expect(testShall.grantedAchievement).to.not.exist;
  });

  it('should not be granted if 2 issues resolved', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    pullRequest.description = [
      '[resolves #1]',
      '[resolves #2]'
    ].join('\n');

    meeseek.check(pullRequest, testShall);
    expect(testShall.grantedToUsername).to.not.exist;
    expect(testShall.grantedAchievement).to.not.exist;
  });

  it('should be granted to PR creator if 4 issues resolved', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    pullRequest.description = [
      '[resolves #1]',
      '[resolves #2]',
      '[resolves #3]',
      '[resolves #4]'
    ].join('\n');

    meeseek.check(pullRequest, testShall);
    expect(testShall.grantedToUsername).to.be.a('string');
    expect(testShall.grantedToUsername).to.equal('creator');
    expect(testShall.grantedAchievement).to.be.an('object');
  });

  it('should not count same issue twice', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    pullRequest.description = [
      '[resolves #1]',
      '[resolves #1]',
      '[resolves #1]',
      '[closes #1]'
    ].join('\n');

    meeseek.check(pullRequest, testShall);
    expect(testShall.grantedToUsername).to.not.exist;
    expect(testShall.grantedAchievement).to.not.exist;
  });

  it('should be case insensitive', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    pullRequest.description = [
      '[Resolves #1]',
      '[resolves #2]',
      '[resolves #3]',
      '[resolves #4]'
    ].join('\n');

    meeseek.check(pullRequest, testShall);
    expect(testShall.grantedToUsername).to.be.a('string');
    expect(testShall.grantedToUsername).to.equal('creator');
    expect(testShall.grantedAchievement).to.be.an('object');
  });

  it('should not count if keyword is between other letters', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    pullRequest.description = [
      '[awesomeresolves #1]', // should not be recognized
      '[resolves #2resolves #3]', // should not be recognized
      'resolves #3nice!',
      '[resolves #4]',
      '[resolves #5]',
      '[resolves #6]'
    ].join('\n');

    meeseek.check(pullRequest, testShall);
    expect(testShall.grantedToUsername).to.not.exist;
    expect(testShall.grantedAchievement).to.not.exist;
  });

  describe('Github\'s resolve keywords', function() {
    it('should recognize "close"', function() {
      var testShall = new Shall();
      var pullRequest = new PullRequest();

      pullRequest.description = [
        '[close #1]', // should not be recognized
        '[close #2]', // should not be recognized
        '[close #3]',
        '[close #4]',
        '[close #5]'
      ].join('\n');

      meeseek.check(pullRequest, testShall);
      expect(testShall.grantedToUsername).to.be.a('string');
      expect(testShall.grantedToUsername).to.equal('creator');
      expect(testShall.grantedAchievement).to.be.an('object');
    });
    it('should recognize "closes"', function() {
      var testShall = new Shall();
      var pullRequest = new PullRequest();

      pullRequest.description = [
        '[closes #1]', // should not be recognized
        '[closes #2]', // should not be recognized
        '[closes #3]',
        '[closes #4]',
        '[closes #5]'
      ].join('\n');

      meeseek.check(pullRequest, testShall);
      expect(testShall.grantedToUsername).to.be.a('string');
      expect(testShall.grantedToUsername).to.equal('creator');
      expect(testShall.grantedAchievement).to.be.an('object');
    });
    it('should recognize "closed"', function() {
      var testShall = new Shall();
      var pullRequest = new PullRequest();

      pullRequest.description = [
        '[closed #1]', // should not be recognized
        '[closed #2]', // should not be recognized
        '[closed #3]',
        '[closed #4]',
        '[closed #5]'
      ].join('\n');

      meeseek.check(pullRequest, testShall);
      expect(testShall.grantedToUsername).to.be.a('string');
      expect(testShall.grantedToUsername).to.equal('creator');
      expect(testShall.grantedAchievement).to.be.an('object');
    });
    it('should recognize "fix"', function() {
      var testShall = new Shall();
      var pullRequest = new PullRequest();

      pullRequest.description = [
        '[fix #1]', // should not be recognized
        '[fix #2]', // should not be recognized
        '[fix #3]',
        '[fix #4]',
        '[fix #5]'
      ].join('\n');

      meeseek.check(pullRequest, testShall);
      expect(testShall.grantedToUsername).to.be.a('string');
      expect(testShall.grantedToUsername).to.equal('creator');
      expect(testShall.grantedAchievement).to.be.an('object');
    });
    it('should recognize "fixes"', function() {
      var testShall = new Shall();
      var pullRequest = new PullRequest();

      pullRequest.description = [
        '[fixes #1]', // should not be recognized
        '[fixes #2]', // should not be recognized
        '[fixes #3]',
        '[fixes #4]',
        '[fixes #5]'
      ].join('\n');

      meeseek.check(pullRequest, testShall);
      expect(testShall.grantedToUsername).to.be.a('string');
      expect(testShall.grantedToUsername).to.equal('creator');
      expect(testShall.grantedAchievement).to.be.an('object');
    });
    it('should recognize "fixed"', function() {
      var testShall = new Shall();
      var pullRequest = new PullRequest();

      pullRequest.description = [
        '[fixed #1]',
        '[fixed #2]',
        '[fixed #3]',
        '[fixed #4]',
        '[fixed #5]'
      ].join('\n');

      meeseek.check(pullRequest, testShall);
      expect(testShall.grantedToUsername).to.be.a('string');
      expect(testShall.grantedToUsername).to.equal('creator');
      expect(testShall.grantedAchievement).to.be.an('object');
    });
    it('should recognize "resolve"', function() {
      var testShall = new Shall();
      var pullRequest = new PullRequest();

      pullRequest.description = [
        '[resolve #1]',
        '[resolve #2]',
        '[resolve #3]',
        '[resolve #4]',
        '[resolve #5]'
      ].join('\n');

      meeseek.check(pullRequest, testShall);
      expect(testShall.grantedToUsername).to.be.a('string');
      expect(testShall.grantedToUsername).to.equal('creator');
      expect(testShall.grantedAchievement).to.be.an('object');
    });
    it('should recognize "resolves"', function() {
      var testShall = new Shall();
      var pullRequest = new PullRequest();

      pullRequest.description = [
        '[resolves #1]',
        '[resolves #2]',
        '[resolves #3]',
        '[resolves #4]',
        '[resolves #5]'
      ].join('\n');

      meeseek.check(pullRequest, testShall);
      expect(testShall.grantedToUsername).to.be.a('string');
      expect(testShall.grantedToUsername).to.equal('creator');
      expect(testShall.grantedAchievement).to.be.an('object');
    });
    it('should recognize "resolved"', function() {
      var testShall = new Shall();
      var pullRequest = new PullRequest();

      pullRequest.description = [
        '[resolved #1]',
        '[resolved #2]',
        '[resolved #3]',
        '[resolved #4]',
        '[resolved #5]'
      ].join('\n');

      meeseek.check(pullRequest, testShall);
      expect(testShall.grantedToUsername).to.be.a('string');
      expect(testShall.grantedToUsername).to.equal('creator');
      expect(testShall.grantedAchievement).to.be.an('object');
    });
    it('should recognize a combination', function() {
      var testShall = new Shall();
      var pullRequest = new PullRequest();

      pullRequest.description = [
        '[closed #1]',
        '[close #2]',
        '[fixed #3]',
        '[resolves #4]',
        '[resolved #5]'
      ].join('\n');

      meeseek.check(pullRequest, testShall);
      expect(testShall.grantedToUsername).to.be.a('string');
      expect(testShall.grantedToUsername).to.equal('creator');
      expect(testShall.grantedAchievement).to.be.an('object');
    });
    // var testShall = new Shall();
    // var pullRequest = new PullRequest();
    //
    // meeseek.check(pullRequest, testShall);
    // expect(testShall.grantedToUsername).to.not.exist;
    // expect(testShall.grantedAchievement).to.not.exist;
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
    'description': '',
    'creator': {
      'username': 'creator'
    }
  };
}
