import moment from 'moment';

import { PullRequest, Shall } from './dev-tools/mocks';
import { member } from './member.achievement';

describe('member achievement', () => {
  it('should not be granted if PR opened less than 2 weeks ago', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    pullRequest.createdOn = moment().subtract(13, 'days').toDate();

    member.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeUndefined();
  });

  it('should be granted if PR opened more than 2 weeks ago', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    pullRequest.createdOn = moment().subtract(15, 'days').toDate();

    member.check(pullRequest, testShall);
    expect(testShall.grantedAchievements.creator).toMatchSnapshot();
  });
});
