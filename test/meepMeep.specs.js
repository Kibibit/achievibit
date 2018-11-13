var meepMeep = require('../achievements/meepMeep.achievement');
var expect = require('chai').expect;

describe('meepMeep achievement', function() {
  it('should grant if COMMENT was within 5 minutes', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();
    
    pullRequest.createdOn = '2018-11-12T16:10:30Z';
    pullRequest.comments.push(createComment('2018-11-12T16:15:00Z'));

    meepMeep.check(pullRequest,testShall);
    expect(testShall.grantedAchievements.creator).to.not.exist;
    expect(testShall.grantedAchievements.narmalComment).to.exist;
    expect(testShall.grantedAchievements.narmalComment).to.be.an('object');
  });

  it('should grant if INLINE-COMMENT was within 5 minutes', function() {
    var testShall = new testShall();
    var pullRequest = new pullRequest();

    pullRequest.createdOn = '2018-11-12T16:10:30Z';
    pullRequest.comments.push(createInlineComment('2018-11-12T16:15:00Z'));

    meepMeep.check(pullRequest,testShall);
    expect(testShall.grantedAchievements.creator).to.not.exist;
    expect(testShall.grantedAchievements.inlineComment).to.exist;
    expect(testShall.grantedAchievements.inlineComment).to.be.an('object');   
  });

  it('should grant to COMMENT if was before INLINE-COMMENT within 5 minutes', function() {
    var testShall = new testShall();
    var pullRequest = new pullRequest();

    pullRequest.createdOn = '2018-11-12T16:10:30Z';
    pullRequest.comments.push(createComment('2018-11-12T16:15:00Z'));
    pullRequest.comments.push(createComment('2018-11-12T16:15:01Z'));

    meepMeep.check(pullRequest,testShall);
    expect(testShall.grantedAchievements.creator).to.not.exist;
    expect(testShall.grantedAchievements.narmalComment).to.exist;
    expect(testShall.grantedAchievements.narmalComment).to.be.an('object');
    expect(testShall.grantedAchievements.inlineComment).to.not.exist;
  });
})

function createComment(dateString) {
  return {
    "author": {
      "username": "narmalComment"
    },
    "createdOn": dateString
  };
};

function createInlineComment(dateString) {
  return {
    "author": {
      "username": "inlineComment"
    },
    "createdOn": dateString
  };
};

function Shall() {
  var self = this;

  self.grantedAchievement = {};

  self.grant = function(username, achievementObject) {
    self.grantedAchievement[username] = achievementObject;
  };
};

function PullRequest() {
  return {
    'id': 'test',
    'url': 'url',
    'creator': {
      'username': 'creator'
    },
    'createdOn': '',
    'comments': [],
    'inlineComments': []
  };
}
