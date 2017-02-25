var usedAllReactionsInComment =
  require('../achievements/usedAllReactionsInComment.achievement');
var expect    = require('chai').expect;

describe('usedAllReactionsInComment achievement', function() {
  describe('should be granted if PR has a message with all reactions',
    function() {
      it('should work with inline comments', function() {
        var testShall = new Shall();
        var pullRequest = new PullRequest();

        pullRequest.inlineComments = [ createQualifiedComment() ];

        usedAllReactionsInComment.check(pullRequest, testShall);
        expect(testShall.grantedToUsername).to.be.a('string');
        expect(testShall.grantedToUsername).to.equal('comment_author');
        expect(testShall.grantedAchievement).to.be.an('object');
      });

      it('should work with PR comments', function() {
        var testShall = new Shall();
        var pullRequest = new PullRequest();

        pullRequest.comments = [ createQualifiedComment() ];

        usedAllReactionsInComment.check(pullRequest, testShall);
        expect(testShall.grantedToUsername).to.be.a('string');
        expect(testShall.grantedToUsername).to.equal('comment_author');
        expect(testShall.grantedAchievement).to.be.an('object');
      });

      it('should work with PR description', function() {
        var testShall = new Shall();
        var pullRequest = new PullRequest();

        pullRequest.reactions = createQualifiedReactions();

        usedAllReactionsInComment.check(pullRequest, testShall);
        expect(testShall.grantedToUsername).to.be.a('string');
        expect(testShall.grantedToUsername).to.equal('creator');
        expect(testShall.grantedAchievement).to.be.an('object');
      });
      it('should work if all reactions + author reaction', function() {
        var testShall = new Shall();
        var pullRequest = new PullRequest();

        pullRequest.reactions = createQualifiedReactions();
        pullRequest.reactions.push({
          'reaction': '+1',
          'user': {
            'username': 'creator'
          }
        });

        usedAllReactionsInComment.check(pullRequest, testShall);
        expect(testShall.grantedToUsername).to.be.a('string');
        expect(testShall.grantedToUsername).to.equal('creator');
        expect(testShall.grantedAchievement).to.be.an('object');
      });
    });

  it('should not grant if comment with less than all reactions', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    pullRequest.inlineComments = [ createQualifiedComment() ];
    pullRequest.inlineComments[0].reactions.pop(); //remove 1 reaction

    usedAllReactionsInComment.check(pullRequest, testShall);
    expect(testShall.grantedToUsername).to.not.exist;
    expect(testShall.grantedAchievement).to.not.exist;
  });

  it('should not grant if author reacted', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    pullRequest.comments = [ createQualifiedComment() ];
    pullRequest.comments[0].reactions[0].user.username = 'comment_author';

    usedAllReactionsInComment.check(pullRequest, testShall);
    expect(testShall.grantedToUsername).to.not.exist;
    expect(testShall.grantedAchievement).to.not.exist;
  });

  it('should not grant if 6 reactions with a duplicate', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    pullRequest.comments = [ createQualifiedComment() ];
    pullRequest.comments[0].reactions[0].reaction = '-1';

    usedAllReactionsInComment.check(pullRequest, testShall);
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

function createQualifiedComment() {
  return {
    'author': {
      'username': 'comment_author'
    },
    'reactions': createQualifiedReactions()
  };
}

function createQualifiedReactions() {
  return [
    {
      'reaction': '+1',
      'user': {
        'username': 'Thatkookooguy'
      }
    },
    {
      'reaction': '-1',
      'user': {
        'username': 'Thatkookooguy'
      }
    },
    {
      'reaction': 'laugh',
      'user': {
        'username': 'Thatkookooguy'
      }
    },
    {
      'reaction': 'hooray',
      'user': {
        'username': 'Thatkookooguy'
      }
    },
    {
      'reaction': 'confused',
      'user': {
        'username': 'Thatkookooguy'
      }
    },
    {
      'reaction': 'heart',
      'user': {
        'username': 'Thatkookooguy'
      }
    }
  ];
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
