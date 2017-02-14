var reactionOnEveryComment =
  require('../achievements/reactionOnEveryComment.achievement');
var expect    = require('chai').expect;

describe('reactionOnEveryComment achievement', function() {
  describe('should be granted if PR and existing comments have reactions',
    function() {
      it('should work with only inline comments', function() {
        var testShall = new Shall();
        var pullRequest = new PullRequest();

        reactionOnEveryComment.check(pullRequest, testShall);
        expect(testShall.grantedToUsername).to.be.a('string');
        expect(testShall.grantedToUsername).to.equal('creator');
        expect(testShall.grantedAchievement).to.be.an('object');
      });

      it('should work with only PR comments', function() {
        var testShall = new Shall();
        var pullRequest = new PullRequest();

        pullRequest.comments = pullRequest.inlineComments;
        pullRequest.inlineComments = [];

        reactionOnEveryComment.check(pullRequest, testShall);
        expect(testShall.grantedToUsername).to.be.a('string');
        expect(testShall.grantedToUsername).to.equal('creator');
        expect(testShall.grantedAchievement).to.be.an('object');
      });

      it('should work with both PR comments & inline comments', function() {
        var testShall = new Shall();
        var pullRequest = new PullRequest();

        pullRequest.comments = pullRequest.inlineComments;

        reactionOnEveryComment.check(pullRequest, testShall);
        expect(testShall.grantedToUsername).to.be.a('string');
        expect(testShall.grantedToUsername).to.equal('creator');
        expect(testShall.grantedAchievement).to.be.an('object');
      });
    }
  );

  it('should not grant if comment with no reactions', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    pullRequest.comments = [];
    pullRequest.comments.push({
      'reactions': []
    });

    reactionOnEveryComment.check(pullRequest, testShall);
    expect(testShall.grantedToUsername).to.not.exist;
    expect(testShall.grantedAchievement).to.not.exist;
  });

  it('should not grant if no comments', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    pullRequest.inlineComments = [];

    reactionOnEveryComment.check(pullRequest, testShall);
    expect(testShall.grantedToUsername).to.not.exist;
    expect(testShall.grantedAchievement).to.not.exist;
  });

  it('should not grant if no reactions on PR', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    pullRequest.reactions = [];

    reactionOnEveryComment.check(pullRequest, testShall);
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
    },
    'reactions': [
      {
        'reaction': '-1',
        'user': {
          'username': 'someone'
        }
      }
    ],
    'inlineComments': [
      {
        'reactions': [
          {
            'reaction': '-1',
            'user': {
              'username': 'someone'
            }
          },
          {
            'reaction': '+1',
            'user': {
              'username': 'someoneElse'
            }
          }
        ]
      }
    ]
  };
}
