import { PullRequest, Shall } from './dev-tools/mocks';
import { optimusPrime } from './optimus-prime.achievement';

describe('optimusPrime achievement', () => {
  it('should be granted to PR creator if PR number is prime', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    pullRequest.number = 3;

    optimusPrime.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeDefined();
    expect(testShall.grantedAchievements.creator).toMatchSnapshot();
  });

  it('should not grant if PR number is 1', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    pullRequest.number = 1;

    optimusPrime.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeUndefined();
  });

  it('should not grant if PR number is not prime', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    pullRequest.number = 40;

    optimusPrime.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeUndefined();
  });

  it('should not fail if PR number does not exist', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    optimusPrime.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeUndefined();
  });
});
