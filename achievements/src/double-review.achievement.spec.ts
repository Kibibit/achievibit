import { PullRequest, Shall } from './dev-tools/mocks';
import { doubleReview } from './double-review.achievement';

describe('doubleReview achievement', function() {
  it('should not be granted if 1 reviewer', function() {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    doubleReview.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeUndefined();
  });

  it('should not be granted if more than 2 reviewers', function() {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    pullRequest.reviewers.push({
      username: 'reviewerTwo'
    });

    pullRequest.reviewers.push({
      username: 'reviewerThree'
    });

    doubleReview.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeUndefined();
  });

  it('should not be granted if 2 reviewers including creator', function() {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    pullRequest.reviewers.push({
      username: 'creator'
    });

    doubleReview.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeUndefined();
  });

  it('should be granted if 2 reviewers excluding creator', function() {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    pullRequest.reviewers.push({
      username: 'reviewerTwo'
    });

    doubleReview.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeDefined();
    expect(testShall.grantedAchievements.creator).toBeUndefined();
    expect(testShall.grantedAchievements.reviewer).toBeDefined();
    expect(testShall.grantedAchievements.reviewer).toMatchSnapshot();
    expect(testShall.grantedAchievements.reviewerTwo).toBeDefined();
    expect(testShall.grantedAchievements.reviewerTwo).toMatchSnapshot()
  });
});
