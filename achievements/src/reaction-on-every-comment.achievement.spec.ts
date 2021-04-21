import { Shall } from './dev-tools/mocks';
import {
  reactionOnEveryComment
} from './reaction-on-every-comment.achievement';

describe('reactionOnEveryComment achievement', () => {
  describe('should be granted if PR and existing comments have reactions',
    () => {
      it('should work with only inline comments', () => {
        const testShall = new Shall();
        const pullRequest = new PullRequest();

        reactionOnEveryComment.check(pullRequest, testShall);
        expect(testShall.grantedAchievements).toBeDefined();
        expect(testShall.grantedAchievements.creator).toMatchSnapshot();
      });

      it('should work with only PR comments', () => {
        const testShall = new Shall();
        const pullRequest = new PullRequest();

        pullRequest.comments = pullRequest.inlineComments;
        pullRequest.inlineComments = [];

        reactionOnEveryComment.check(pullRequest, testShall);
        expect(testShall.grantedAchievements).toBeDefined();
        expect(testShall.grantedAchievements.creator).toMatchSnapshot();
      });

      it('should work with both PR comments & inline comments', () => {
        const testShall = new Shall();
        const pullRequest = new PullRequest();

        pullRequest.comments = pullRequest.inlineComments;

        reactionOnEveryComment.check(pullRequest, testShall);
        expect(testShall.grantedAchievements).toBeDefined();
        expect(testShall.grantedAchievements.creator).toMatchSnapshot();
      });
    }
  );

  it('should not grant if comment with no reactions', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    pullRequest.comments = [];
    pullRequest.comments.push({
      'reactions': []
    });

    reactionOnEveryComment.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeUndefined();
  });

  it('should not grant if no comments', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    pullRequest.inlineComments = [];

    reactionOnEveryComment.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeUndefined();
  });

  it('should not grant if no reactions on PR', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    pullRequest.reactions = [];

    reactionOnEveryComment.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeUndefined();
  });
});

class PullRequest {
    id = 'test';
    url = 'url';
    number = 3;
    comments: any[];
    creator = {
      username: 'creator'
    };
    reactions = [
      {
        reaction: '-1',
        user: {
          username: 'someone'
        }
      }
    ];
    inlineComments = [
      {
        reactions: [
          {
            reaction: '-1',
            user: {
              username: 'someone'
            }
          },
          {
            reaction: '+1',
            user: {
              username: 'someoneElse'
            }
          }
        ]
      }
    ];
}
