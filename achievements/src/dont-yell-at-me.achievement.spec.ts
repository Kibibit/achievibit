import { PullRequest, Shall } from './dev-tools/mocks';
import { dontYellAtMe } from './dont-yell-at-me.achievement';

const ALL_CAPS_REASON = 'ALL CAPS';
const EXCLAMATION_REASON = '3 or more exclamation marks';
const MIXED_REASONS = ALL_CAPS_REASON + ' and ' + EXCLAMATION_REASON;


describe('dontYellAtMe achievement', () => {
  it('should not be granted if all letters are lowercase', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    dontYellAtMe.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeUndefined();
  });

  it('should not be granted if title is empty', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    pullRequest.title = '';

    dontYellAtMe.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeUndefined();
  });

  it('should not be granted if letters are mixed case', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    pullRequest.title = 'Title';

    dontYellAtMe.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeUndefined();
  });

  it('should not be granted if there are less than 3 \'!\'', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    pullRequest.title = 'title!!';

    dontYellAtMe.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeUndefined();
  });

  it('should not be granted if all caps only in tags', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    pullRequest.title = '[FOO]';

    dontYellAtMe.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeUndefined();
  });

  it('should not be granted if title does not contain letters', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    pullRequest.title = '#42';

    dontYellAtMe.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeUndefined();
  });

  it('should be granted to PR creator if title is all caps', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    pullRequest.title = 'FOO';

    dontYellAtMe.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeDefined();
    expect(testShall.grantedAchievements.creator.description)
      .toContain(ALL_CAPS_REASON);
    expect(testShall.grantedAchievements.creator).toMatchSnapshot();
  });

  it('should be granted to PR creator if more than 2 \'!\'', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    pullRequest.title = 'foo!!!';

    dontYellAtMe.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeDefined();
    expect(testShall.grantedAchievements.creator.description)
      .toContain(EXCLAMATION_REASON);
    expect(testShall.grantedAchievements.creator).toMatchSnapshot();
  });

  it('should be granted to PR creator if both reasons', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    pullRequest.title = 'FOO!!!';

    dontYellAtMe.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeDefined();
    expect(testShall.grantedAchievements.creator.description)
      .toContain(MIXED_REASONS);
    expect(testShall.grantedAchievements.creator).toMatchSnapshot();
  });
});
