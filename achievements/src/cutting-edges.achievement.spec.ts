import { cuttingEdge } from './cutting-edges.achievement';
import { PullRequest, Shall } from './dev-tools/mocks';

describe('Cutting Edges achievement', () => {
  it('should not be granted if pull request is not merged', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    cuttingEdge.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeUndefined();
  });

  it('should not be granted if pull request was merged with approvals', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    pullRequest.merged = true;
    pullRequest.reviews = [
      {
        id: 'review',
        state: 'APPROVED'
      }
    ];

    cuttingEdge.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeUndefined();
  });

  it('should be granted if pull request was merged without approvals', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    pullRequest.merged = true;
    pullRequest.reviews = [];

    cuttingEdge.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeDefined();
    expect(testShall.grantedAchievements.creator).toMatchSnapshot();
  });
});
