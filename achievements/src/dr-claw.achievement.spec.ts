import { PullRequest, Shall } from './dev-tools/mocks';
import { createComment } from './dev-tools/utils';
import { drClaw } from './dr-claw.achievement';

const MESSAGE_INCREASED = [
  '[![Coverage Status](https://coveralls.io/builds/10085689/badge)]',
  '(https://coveralls.io/builds/10085689)\n\nCoverage increased (+2.6%) to ',
  '39.32% when pulling **c07c2c6c1d5043fe4e916625ab3c537ca6d1b966 on ',
  'achievement-dont-yell-at-me** into ',
  '**ed92c7d04925ad4b4972c69b45daea5c595eb2a9 on master**.'
].join('');

const MESSAGE_NOT_ENOUGH_DECREASED = [
  '[![Coverage Status](https://coveralls.io/builds/10085689/badge)]',
  '(https://coveralls.io/builds/10085689)\n\nCoverage decreased (-1.6%) to ',
  '39.32% when pulling **c07c2c6c1d5043fe4e916625ab3c537ca6d1b966 on ',
  'achievement-dont-yell-at-me** into ',
  '**ed92c7d04925ad4b4972c69b45daea5c595eb2a9 on master**.'
].join('');

const MESSAGE_DECREASED = [
  '[![Coverage Status](https://coveralls.io/builds/10076567/badge)]',
  '(https://coveralls.io/builds/10076567)\n\nCoverage decreased (-6.2%) to ',
  '31.285% when pulling **f63b4b15d94e67fbd37f58342d9899390ea05224 on ',
  'fix-port** into **e3ad341b991dc9bac57f50fc87a15113b7e62735 on master**.'
].join('');

const MESSAGE_DECREASED_EVEN_MORE = [
  '[![Coverage Status](https://coveralls.io/builds/10085689/badge)]',
  '(https://coveralls.io/builds/10085689)\n\nCoverage decreased (-10.6%) to ',
  '39.32% when pulling **c07c2c6c1d5043fe4e916625ab3c537ca6d1b966 on ',
  'achievement-dont-yell-at-me** into ',
  '**ed92c7d04925ad4b4972c69b45daea5c595eb2a9 on master**.'
].join('');


describe('drClaw achievement', () => {
  it('should not be granted if comments undefined', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    drClaw.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeUndefined();
  });

  it('should not be granted if no comments', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    pullRequest.comments = [];

    drClaw.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeUndefined();
  });

  it('should not be granted if no coverall comments', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    pullRequest.comments = [];
    // same comment by a user that is not 'coverall'
    pullRequest.comments
      .push(createComment('inspector gadget', MESSAGE_DECREASED));

    drClaw.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeUndefined();
  });

  it('should not be granted if coverage increased', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    pullRequest.comments = [];
    pullRequest.comments
      .push(createComment('coveralls', MESSAGE_INCREASED));

    drClaw.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeUndefined();
  });

  it('should not be granted if percentage lower than 2', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    pullRequest.comments = [];
    pullRequest.comments
      .push(createComment('coveralls', MESSAGE_NOT_ENOUGH_DECREASED));

    drClaw.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeUndefined();
  });

  it('should be granted to PR creator if coverage decreased by 2+', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    pullRequest.comments = [];
    pullRequest.comments
      .push(createComment('coveralls', MESSAGE_DECREASED));

    drClaw.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeDefined();
    expect(testShall.grantedAchievements.creator).toMatchSnapshot();
  });

  it('should parse only last coverall comment', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    pullRequest.comments = [];
    pullRequest.comments
      .push(createComment('coveralls', MESSAGE_INCREASED));
    pullRequest.comments
      .push(createComment('coveralls', MESSAGE_DECREASED));

    drClaw.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeDefined();
    expect(testShall.grantedAchievements.creator).toMatchSnapshot();
  });

  it('should write in description last decreased percentage', () => {
    const testShallBiggerLast = new Shall();
    const testShallBiggerFirst = new Shall();
    const pullRequestBiggerLast = new PullRequest();
    const pullRequestBiggerFirst = new PullRequest();

    pullRequestBiggerLast.comments = [];
    pullRequestBiggerLast.comments
      .push(createComment('coveralls', MESSAGE_DECREASED));
    pullRequestBiggerLast.comments
      .push(createComment('coveralls', MESSAGE_DECREASED_EVEN_MORE));

    pullRequestBiggerFirst.comments = [];
    pullRequestBiggerFirst.comments
      .push(createComment('coveralls', MESSAGE_DECREASED_EVEN_MORE));
    pullRequestBiggerFirst.comments
      .push(createComment('coveralls', MESSAGE_DECREASED));

    drClaw.check(pullRequestBiggerLast, testShallBiggerLast);
    expect(testShallBiggerLast.grantedAchievements).toBeDefined();
    expect(testShallBiggerLast.grantedAchievements.creator).toMatchSnapshot();
    expect(testShallBiggerLast.grantedAchievements.creator.description)
      .toContain('-10.6');

    drClaw.check(pullRequestBiggerFirst, testShallBiggerFirst);
    expect(testShallBiggerFirst.grantedAchievements).toBeDefined();
    expect(testShallBiggerFirst.grantedAchievements.creator).toMatchSnapshot();
    expect(testShallBiggerFirst.grantedAchievements.creator.description)
      .toContain('-6.2');
  });


});
