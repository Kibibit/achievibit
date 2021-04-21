import { PullRequest, Shall } from './dev-tools/mocks';
import { meeseek } from './meeseek.achievement';

describe('meeseek achievement', () => {
  it('should not be granted if no issues resolved', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    meeseek.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeUndefined();
  });

  it('should not be granted if 1 issues resolved', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    pullRequest.description = [
      '[resolves #1]'
    ].join('\n');

    meeseek.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeUndefined();
  });

  it('should not be granted if 2 issues resolved', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    pullRequest.description = [
      '[resolves #1]',
      '[resolves #2]'
    ].join('\n');

    meeseek.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeUndefined();
  });

  it('should be granted to PR creator if 4 issues resolved', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    pullRequest.description = [
      '[resolves #1]',
      '[resolves #2]',
      '[resolves #3]',
      '[resolves #4]'
    ].join('\n');

    meeseek.check(pullRequest, testShall);

    expect(testShall.grantedAchievements.creator).toMatchSnapshot();
  });

  it('should not count same issue twice', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    pullRequest.description = [
      '[resolves #1]',
      '[resolves #1]',
      '[resolves #1]',
      '[closes #1]'
    ].join('\n');

    meeseek.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeUndefined();
  });

  it('should be case insensitive', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    pullRequest.description = [
      '[Resolves #1]',
      '[resolves #2]',
      '[resolves #3]',
      '[resolves #4]'
    ].join('\n');

    meeseek.check(pullRequest, testShall);

    expect(testShall.grantedAchievements.creator).toMatchSnapshot();
  });

  it('should not count if keyword is between other letters', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    pullRequest.description = [
      '[awesomeresolves #1]', // should not be recognized
      '[resolves #2resolves #3]', // should not be recognized
      'resolves #3nice!',
      '[resolves #4]',
      '[resolves #5]',
      '[resolves #6]'
    ].join('\n');

    meeseek.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeUndefined();
  });

  describe('Github\'s resolve keywords', () => {
    it('should recognize "close"', () => {
      const testShall = new Shall();
      const pullRequest = new PullRequest();

      pullRequest.description = [
        '[close #1]', // should not be recognized
        '[close #2]', // should not be recognized
        '[close #3]',
        '[close #4]',
        '[close #5]'
      ].join('\n');

      meeseek.check(pullRequest, testShall);

      expect(testShall.grantedAchievements.creator).toMatchSnapshot();
    });
    it('should recognize "closes"', () => {
      const testShall = new Shall();
      const pullRequest = new PullRequest();

      pullRequest.description = [
        '[closes #1]', // should not be recognized
        '[closes #2]', // should not be recognized
        '[closes #3]',
        '[closes #4]',
        '[closes #5]'
      ].join('\n');

      meeseek.check(pullRequest, testShall);

      expect(testShall.grantedAchievements.creator).toMatchSnapshot();
    });
    it('should recognize "closed"', () => {
      const testShall = new Shall();
      const pullRequest = new PullRequest();

      pullRequest.description = [
        '[closed #1]', // should not be recognized
        '[closed #2]', // should not be recognized
        '[closed #3]',
        '[closed #4]',
        '[closed #5]'
      ].join('\n');

      meeseek.check(pullRequest, testShall);

      expect(testShall.grantedAchievements.creator).toMatchSnapshot();
    });
    it('should recognize "fix"', () => {
      const testShall = new Shall();
      const pullRequest = new PullRequest();

      pullRequest.description = [
        '[fix #1]', // should not be recognized
        '[fix #2]', // should not be recognized
        '[fix #3]',
        '[fix #4]',
        '[fix #5]'
      ].join('\n');

      meeseek.check(pullRequest, testShall);

      expect(testShall.grantedAchievements.creator).toMatchSnapshot();
    });
    it('should recognize "fixes"', () => {
      const testShall = new Shall();
      const pullRequest = new PullRequest();

      pullRequest.description = [
        '[fixes #1]', // should not be recognized
        '[fixes #2]', // should not be recognized
        '[fixes #3]',
        '[fixes #4]',
        '[fixes #5]'
      ].join('\n');

      meeseek.check(pullRequest, testShall);

      expect(testShall.grantedAchievements.creator).toMatchSnapshot();
    });
    it('should recognize "fixed"', () => {
      const testShall = new Shall();
      const pullRequest = new PullRequest();

      pullRequest.description = [
        '[fixed #1]',
        '[fixed #2]',
        '[fixed #3]',
        '[fixed #4]',
        '[fixed #5]'
      ].join('\n');

      meeseek.check(pullRequest, testShall);

      expect(testShall.grantedAchievements.creator).toMatchSnapshot();
    });
    it('should recognize "resolve"', () => {
      const testShall = new Shall();
      const pullRequest = new PullRequest();

      pullRequest.description = [
        '[resolve #1]',
        '[resolve #2]',
        '[resolve #3]',
        '[resolve #4]',
        '[resolve #5]'
      ].join('\n');

      meeseek.check(pullRequest, testShall);
      expect(testShall.grantedAchievements.creator).toMatchSnapshot();
    });
    it('should recognize "resolves"', () => {
      const testShall = new Shall();
      const pullRequest = new PullRequest();

      pullRequest.description = [
        '[resolves #1]',
        '[resolves #2]',
        '[resolves #3]',
        '[resolves #4]',
        '[resolves #5]'
      ].join('\n');

      meeseek.check(pullRequest, testShall);

      expect(testShall.grantedAchievements.creator).toMatchSnapshot();
    });
    it('should recognize "resolved"', () => {
      const testShall = new Shall();
      const pullRequest = new PullRequest();

      pullRequest.description = [
        '[resolved #1]',
        '[resolved #2]',
        '[resolved #3]',
        '[resolved #4]',
        '[resolved #5]'
      ].join('\n');

      meeseek.check(pullRequest, testShall);

      expect(testShall.grantedAchievements.creator).toMatchSnapshot();
    });
    it('should recognize a combination', () => {
      const testShall = new Shall();
      const pullRequest = new PullRequest();

      pullRequest.description = [
        '[closed #1]',
        '[close #2]',
        '[fixed #3]',
        '[resolves #4]',
        '[resolved #5]'
      ].join('\n');

      meeseek.check(pullRequest, testShall);
      expect(testShall.grantedAchievements.creator).toMatchSnapshot();
    });
  });
});
