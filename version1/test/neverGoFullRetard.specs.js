var neverGoFullRetard =
  require('../achievements/neverGoFullRetard.achievement');
var expect    = require('chai').expect;

describe('neverGoFullRetard achievement', function() {
  it('should be granted for all supported files', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();
    pullRequest.files = new ImagesFileArray('image.png');
    pullRequest.files.push({ name: 'image.jpg' });
    pullRequest.files.push({ name: 'image.jpeg' });
    pullRequest.files.push({ name: 'image.ico' });
    pullRequest.files.push({ name: 'image.svg' });
    pullRequest.files.push({ name: 'image.gif' });
    pullRequest.files.push({ name: 'image.icns' });

    neverGoFullRetard.check(pullRequest, testShall);
    expect(testShall.grantedAchievements.creator).to.exist;
    expect(testShall.grantedAchievements.creator).to.be.an('object');
  });

  it('should be granted to creator and reviewers', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();
    pullRequest.reviewers = [
      {
        username: 'firstReviewer'
      },
      {
        username: 'secondReviewer'
      }
    ];

    pullRequest.files = new ImagesFileArray('image.png');
    pullRequest.files.push({ name: 'image.jpg' });
    pullRequest.files.push({ name: 'image.jpeg' });
    pullRequest.files.push({ name: 'image.ico' });
    pullRequest.files.push({ name: 'image.svg' });
    pullRequest.files.push({ name: 'image.gif' });
    pullRequest.files.push({ name: 'image.icns' });

    neverGoFullRetard.check(pullRequest, testShall);
    expect(testShall.grantedAchievements.creator).to.exist;
    expect(testShall.grantedAchievements.firstReviewer).to.exist;
    expect(testShall.grantedAchievements.secondReviewer).to.exist;
    expect(testShall.grantedAchievements.creator).to.be.an('object');
  });

  it('should not be granted if no files array', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();

    neverGoFullRetard.check(pullRequest, testShall);
    expect(testShall.grantedToUsername).to.not.exist;
    expect(testShall.grantedAchievement).to.not.exist;
  });

  it('should not be granted if files array is empty', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();
    pullRequest.files = [];

    neverGoFullRetard.check(pullRequest, testShall);
    expect(testShall.grantedToUsername).to.not.exist;
    expect(testShall.grantedAchievement).to.not.exist;
  });

  it('should not be granted if files are not images', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();
    pullRequest.files = new ImagesFileArray('notImage.js');

    neverGoFullRetard.check(pullRequest, testShall);
    expect(testShall.grantedToUsername).to.not.exist;
    expect(testShall.grantedAchievement).to.not.exist;
  });

  it('should not be granted if files are mixed', function() {
    var testShall = new Shall();
    var pullRequest = new PullRequest();
    pullRequest.files = new ImagesFileArray('notImage.js');
    pullRequest.files.push({ name: 'image.jpg' });

    neverGoFullRetard.check(pullRequest, testShall);
    expect(testShall.grantedToUsername).to.not.exist;
    expect(testShall.grantedAchievement).to.not.exist;
  });
});

function Shall() {
  var self = this;

  self.grantedAchievements = {};

  self.grant = function(username, achievementObject) {
    self.grantedAchievements[username] = achievementObject;
  };
}

function PullRequest() {
  return {
    'id': 'test',
    'url': 'url',
    'creator': {
      'username': 'creator'
    }
  };
}

function ImagesFileArray(filename) {
  return [
    {
      name: filename || 'image.png'
    }
  ];
}
