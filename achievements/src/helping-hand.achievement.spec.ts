import { PullRequest, Shall } from './dev-tools/mocks';
import { helpingHand } from './helping-hand.achievement';

describe('helpingHand achievement', () => {
  it('should not be granted if PR creator is the only committer', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    helpingHand.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeUndefined();
  });

  it('should not be granted if PR creator is also the reviewer', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    pullRequest.reviewers[0].username = 'creator';

    helpingHand.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeUndefined();
  });

  it('should not be granted if random committer', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    pullRequest.commits = [];

    pullRequest.commits.push({
      'author': {
        'username': 'k1bib0t'
      }
    });

    helpingHand.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeUndefined();
  });

  it('should be granted if PR reviewer added commit', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    pullRequest.commits = [];

    pullRequest.commits.push({
      'author': {
        'username': 'reviewer'
      }
    });

    helpingHand.check(pullRequest, testShall);
    expect(testShall.grantedAchievements.creator).toBeDefined();
    expect(testShall.grantedAchievements.creator).toMatchSnapshot();
    expect(testShall.grantedAchievements.reviewer).toBeDefined();
    expect(testShall.grantedAchievements.reviewer).toMatchSnapshot();
    expect(testShall.grantedAchievements.creator.description)
      .not.toContain('Your reviewers');
  });

  it('should add indication if more than one PR reviewer', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    pullRequest.reviewers.push({
      'username': '2nd'
    });

    pullRequest.commits = [];

    pullRequest.commits.push({
      'author': {
        'username': 'reviewer'
      }
    });

    pullRequest.commits.push({
      'author': {
        'username': '2nd'
      }
    });

    helpingHand.check(pullRequest, testShall);
    expect(testShall.grantedAchievements.creator).toBeDefined();
    expect(testShall.grantedAchievements.creator).toMatchSnapshot();
    expect(testShall.grantedAchievements.reviewer).toBeDefined();
    expect(testShall.grantedAchievements.reviewer).toMatchSnapshot();
    expect(testShall.grantedAchievements.reviewer).toBeDefined();
    expect(testShall.grantedAchievements['2nd']).toMatchSnapshot();
    expect(testShall.grantedAchievements.creator.description)
      .toContain('Your reviewers');
  });
});
