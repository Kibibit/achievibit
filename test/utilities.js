var expect    = require('chai').expect;
var utilities = require('../utilities');

var githubUser = {
  'login': 'login',
  'html_url': 'html_url',
  'avatar_url': 'avatar_url'
};

describe('achievibit Utilities', function() {
  describe('parseUser GitHub User to achievibit User', function() {
    it('should get the correct data', function() {
      var achievibitUser = utilities.parseUser(githubUser, false);
      expect(achievibitUser).to.be.an('object');
      expect(achievibitUser).to.include.keys('username', 'url', 'avatar');
    });

    it('should flag as organization if set to true', function() {
      var achievibitUser = utilities.parseUser(githubUser, true);
      expect(achievibitUser).to.be.an('object');
      expect(achievibitUser)
        .to.include.keys('username', 'url', 'avatar', 'organization');
    });
  });

  describe('getPullRequestIdFromEventData', function() {
    it('should create an id string out of GitHub\'s eventData', function() {
      var eventData = {
        number: 1,
        repository: {
          'full_name': 'repo'
        }
      };
      var id = utilities.getPullRequestIdFromEventData(eventData);
      expect(id).to.be.a('string');
      expect(id).to.equal('repo/pull/1');
    });
  });
});
