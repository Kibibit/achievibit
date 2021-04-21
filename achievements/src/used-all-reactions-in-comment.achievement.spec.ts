import { PullRequest, Shall } from './dev-tools/mocks';
import {
  usedAllReactionsInComment
} from './used-all-reactions-in-comment.achievement';

describe('usedAllReactionsInComment achievement', () => {
  describe('should be granted if PR has a message with all reactions',
    () => {
      it('should work with inline comments', () => {
        const testShall = new Shall();
        const pullRequest = new PullRequest();

        pullRequest.inlineComments = [ createQualifiedComment() ];

        usedAllReactionsInComment.check(pullRequest, testShall);
        expect(testShall.grantedAchievements).toBeDefined();
        expect(testShall.grantedAchievements.comment_author).toMatchSnapshot();
      });

      it('should work with PR comments', () => {
        const testShall = new Shall();
        const pullRequest = new PullRequest();

        pullRequest.comments = [ createQualifiedComment() ];

        usedAllReactionsInComment.check(pullRequest, testShall);
        expect(testShall.grantedAchievements).toBeDefined();
        expect(testShall.grantedAchievements.comment_author).toMatchSnapshot();
      });

      it('should work with PR description', () => {
        const testShall = new Shall();
        const pullRequest = new PullRequest();

        pullRequest.reactions = createQualifiedReactions();

        usedAllReactionsInComment.check(pullRequest, testShall);
        expect(testShall.grantedAchievements).toBeDefined();
        expect(testShall.grantedAchievements.creator).toMatchSnapshot();
      });
      it('should work if all reactions + author reaction', () => {
        const testShall = new Shall();
        const pullRequest = new PullRequest();

        pullRequest.reactions = createQualifiedReactions();
        pullRequest.reactions.push({
          'reaction': '+1',
          'user': {
            'username': 'creator'
          }
        });

        usedAllReactionsInComment.check(pullRequest, testShall);
        expect(testShall.grantedAchievements).toBeDefined();
        expect(testShall.grantedAchievements.creator).toMatchSnapshot();
      });
    });

  it('should not grant if comment with less than all reactions', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    pullRequest.inlineComments = [ createQualifiedComment() ];
    pullRequest.inlineComments[0].reactions.pop(); //remove 1 reaction

    usedAllReactionsInComment.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeUndefined();
  });

  it('should not grant if author reacted', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    pullRequest.comments = [ createQualifiedComment() ];
    pullRequest.comments[0].reactions[0].user.username = 'comment_author';

    usedAllReactionsInComment.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeUndefined();
  });

  it('should not grant if 6 reactions with a duplicate', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    pullRequest.comments = [ createQualifiedComment() ];
    pullRequest.comments[0].reactions[0].reaction = '-1';

    usedAllReactionsInComment.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeUndefined();
  });
});

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
