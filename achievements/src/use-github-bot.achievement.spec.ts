import { PullRequest, Shall } from './dev-tools/mocks';
import { githubBot } from './use-github-bot.achievement';

const mockCommits = [
  {
    author: {
      username: 'commit-author'
    },
    committer: {
      username: 'web-flow'
    }
  }
];

describe('githubBot achievement', () => {
  it('should be granted if committer username is web-flow', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();
    pullRequest.commits = mockCommits;

    githubBot.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeDefined();
    expect(testShall.grantedAchievements.creator).toMatchSnapshot();
  });

  it('should not grant if committer is not web-flow', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();
    pullRequest.commits = mockCommits;
    pullRequest.commits[0].committer.username = 'not-web-flow';

    githubBot.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeUndefined();
  });
});
