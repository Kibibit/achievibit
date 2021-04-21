import { PullRequest, Shall } from './dev-tools/mocks';
import { createComment } from './dev-tools/utils';
import { mrMiyagi } from './mr-miyagi.achievement';

const MESSAGE_INCREASED_BELOW_100 = [
  '[![Coverage Status](https://coveralls.io/builds/10085689/badge)]',
  '(https://coveralls.io/builds/10085689)\n\nCoverage increased (+2.6%) to ',
  '99.99% when pulling **c07c2c6c1d5043fe4e916625ab3c537ca6d1b966 on ',
  'achievement-dont-yell-at-me** into ',
  '**ed92c7d04925ad4b4972c69b45daea5c595eb2a9 on master**.'
].join('');

const MESSAGE_INCREASED_TO_100 = [
  '[![Coverage Status](https://coveralls.io/builds/10085689/badge)]',
  '(https://coveralls.io/builds/10085689)\n\nCoverage increased (+2.6%) to ',
  '100.0% when pulling **c07c2c6c1d5043fe4e916625ab3c537ca6d1b966 on ',
  'achievement-dont-yell-at-me** into ',
  '**ed92c7d04925ad4b4972c69b45daea5c595eb2a9 on master**.'
].join('');


describe('mrMiyagi achievement', () => {
  it('should not be granted if comments undefined', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    mrMiyagi.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeUndefined();
  });

  it('should not be granted if no comments', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    pullRequest.comments = [];

    mrMiyagi.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeUndefined();
  });

  it('should not be granted if no coverall comments', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    pullRequest.comments = [];
    pullRequest.comments
      .push(createComment('mrMiyagi', MESSAGE_INCREASED_TO_100));

    mrMiyagi.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeUndefined();
  });

  it('should not be granted if coverage increased below 100%', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    pullRequest.comments = [];
    pullRequest.comments
      .push(createComment('coveralls', MESSAGE_INCREASED_BELOW_100));

    mrMiyagi.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeUndefined();
  });

  it('should be granted to PR creator if coverage increased to 100%',
    () => {
      const testShall = new Shall();
      const pullRequest = new PullRequest();

      pullRequest.comments = [];
      pullRequest.comments
        .push(createComment('coveralls', MESSAGE_INCREASED_TO_100));

      mrMiyagi.check(pullRequest, testShall);
      expect(testShall.grantedAchievements).toBeDefined();
      expect(testShall.grantedAchievements.creator).toMatchSnapshot();
    }
  );

  it('should write in description the PR creator username', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    pullRequest.comments = [];
    pullRequest.comments
      .push(createComment('coveralls', MESSAGE_INCREASED_TO_100));

    mrMiyagi.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeDefined();
    expect(testShall.grantedAchievements.creator.description)
      .toContain(pullRequest.creator.username + '-san');
  });


});
