import { PullRequest, Shall } from './dev-tools/mocks';
import {
  theGodfatherConsigliere
} from './the-godfather-consigliere.achievement';

describe('theGodfatherConsigliere achievement', () => {
  it('should be granted to PR creator if organization is Kibibit', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    const organization = {
      'username': 'Kibibit'
    };

    pullRequest.organization = organization;

    theGodfatherConsigliere.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeDefined();
    expect(testShall.grantedAchievements.creator).toMatchSnapshot();
  });

  it('should not grant if no organization', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    theGodfatherConsigliere.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeUndefined();
  });

  it('should not grant if organization is not Kibibit', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    const organization = {
      'username': 'Gibibit'
    };

    pullRequest.organization = organization;

    theGodfatherConsigliere.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeUndefined();
  });
});
