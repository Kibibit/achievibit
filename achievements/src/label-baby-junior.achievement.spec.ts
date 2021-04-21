import { PullRequest, Shall } from './dev-tools/mocks';
import { labelBabyJunior } from './label-baby-junior.achievement';

describe('labelBabyJunior achievement', () => {
  it('should not be granted if PR labels are undefined', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    labelBabyJunior.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeUndefined();
  });

  it('should not be granted if PR has no labels', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    pullRequest.labels = [];

    labelBabyJunior.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeUndefined();
  });

  it('should not be granted if less than 6 labels', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    pullRequest.labels = [
      'label1',
      'label2',
      'label3',
      'label4',
      'label5'
    ];

    labelBabyJunior.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeUndefined();
  });

  it('should be granted to PR creator if more than 5 labels', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    pullRequest.labels = [
      'label1',
      'label2',
      'label3',
      'label4',
      'label5',
      'label6'
    ];

    labelBabyJunior.check(pullRequest, testShall);
    expect(testShall.grantedAchievements.creator).toMatchSnapshot();
  });
});
