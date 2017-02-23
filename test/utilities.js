var expect    = require('chai').expect;
var utilities = require('../utilities');

describe('achievibit Utilities', function() {
  describe('parseUser - GitHub User to achievibit User', function() {
    it('should return the correct data', function() {
      var achievibitUser = utilities.parseUser(new GithubUser(), false);
      expect(achievibitUser).to.be.an('object');
      expect(achievibitUser).to.include.keys('username', 'url', 'avatar');
    });

    it('should flag as organization if set to true', function() {
      var achievibitUser = utilities.parseUser(new GithubUser(), true);
      expect(achievibitUser).to.be.an('object');
      expect(achievibitUser)
        .to.include.keys('username', 'url', 'avatar', 'organization');
    });
  });

  describe('parseRepo - GitHub Repo to achievibit Repo', function() {
    it('should return the correct data', function() {
      var achievibitUser = utilities.parseRepo(new GithubRepo());
      expect(achievibitUser).to.be.an('object');
      expect(achievibitUser).to.include.keys('name', 'fullname', 'url');
    });
  });

  describe('isPullRequestAssociatedWithOrganization', function() {
    it('should return true if associated with organization', function() {
      var pullRequest = new PullRequest();
      pullRequest.repository.owner.type = 'Organization';
      var isOrganizationPresent =
        utilities.isPullRequestAssociatedWithOrganization(pullRequest);
      expect(isOrganizationPresent).to.be.a('boolean');
      expect(isOrganizationPresent).to.be.true;
    });

    it('should return false if NOT associated with organization', function() {
      var pullRequest = new PullRequest();
      var isOrganizationPresent =
        utilities.isPullRequestAssociatedWithOrganization(pullRequest);
      expect(isOrganizationPresent).to.be.a('boolean');
      expect(isOrganizationPresent).to.be.false;
    });
  });

  describe('getPullRequestIdFromEventData', function() {
    it('should create an id string out of GitHub\'s eventData', function() {
      var eventData = {
        'pull_request': {
          number: 1
        },
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

function GithubRepo() {
  return {
    'name': 'repo-name',
    'full_name': 'repo-fullname',
    'html_url': 'repo-url',
    'owner': new GithubUser()
  };
}

function GithubUser() {
  return {
    'login': 'login',
    'html_url': 'html_url',
    'avatar_url': 'avatar_url'
  };
}

function PullRequest() {
  return {
    'id': 'test',
    'url': 'url',
    'number': 3,
    'creator': {
      'username': 'creator'
    },
    'repository': new GithubRepo()
  };
}
