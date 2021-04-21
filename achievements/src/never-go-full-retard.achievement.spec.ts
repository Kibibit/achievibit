import { PullRequest, Shall } from './dev-tools/mocks';
import { neverGoFullRetard } from './never-go-full-retard.achievement';

describe('neverGoFullRetard achievement', function() {
  it('should be granted for all supported files', function() {
    const testShall = new Shall();
    const pullRequest = new PullRequest();
    pullRequest.files = ImagesFileArray('image.png');
    pullRequest.files.push({ name: 'image.jpg' });
    pullRequest.files.push({ name: 'image.jpeg' });
    pullRequest.files.push({ name: 'image.ico' });
    pullRequest.files.push({ name: 'image.svg' });
    pullRequest.files.push({ name: 'image.gif' });
    pullRequest.files.push({ name: 'image.icns' });

    neverGoFullRetard.check(pullRequest, testShall);
    expect(testShall.grantedAchievements.creator).toBeDefined();
    expect(testShall.grantedAchievements.creator).toMatchSnapshot();
  });

  it('should be granted to creator and reviewers', function() {
    const testShall = new Shall();
    const pullRequest = new PullRequest();
    pullRequest.reviewers = [
      {
        username: 'firstReviewer'
      },
      {
        username: 'secondReviewer'
      }
    ];

    pullRequest.files = ImagesFileArray('image.png');
    pullRequest.files.push({ name: 'image.jpg' });
    pullRequest.files.push({ name: 'image.jpeg' });
    pullRequest.files.push({ name: 'image.ico' });
    pullRequest.files.push({ name: 'image.svg' });
    pullRequest.files.push({ name: 'image.gif' });
    pullRequest.files.push({ name: 'image.icns' });

    neverGoFullRetard.check(pullRequest, testShall);
    expect(testShall.grantedAchievements.creator).toBeDefined();
    expect(testShall.grantedAchievements.firstReviewer).toBeDefined();
    expect(testShall.grantedAchievements.secondReviewer).toBeDefined();
    expect(testShall.grantedAchievements.creator).toMatchSnapshot();
  });

  it('should not be granted if no files array', function() {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    neverGoFullRetard.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeUndefined();
  });

  it('should not be granted if files array is empty', function() {
    const testShall = new Shall();
    const pullRequest = new PullRequest();
    pullRequest.files = [];

    neverGoFullRetard.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeUndefined();
  });

  it('should not be granted if files are not images', function() {
    const testShall = new Shall();
    const pullRequest = new PullRequest();
    pullRequest.files = ImagesFileArray('notImage.js');

    neverGoFullRetard.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeUndefined();
  });

  it('should not be granted if files are mixed', function() {
    const testShall = new Shall();
    const pullRequest = new PullRequest();
    pullRequest.files = ImagesFileArray('notImage.js');
    pullRequest.files.push({ name: 'image.jpg' });

    neverGoFullRetard.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeUndefined();
  });
});

function ImagesFileArray(filename: string) {
  return [
    {
      name: filename || 'image.png'
    }
  ];
}
