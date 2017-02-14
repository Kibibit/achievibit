var expect    = require('chai').expect;
var utilities = require('../utilities');

describe('achievibit Utilities', function() {
  describe('parseStatuses', function() {
    it('should ignore pending statuses', function() {
      var statuses = [
        new Status('commit1', 'pending')
      ];

      var parsedStatuses = utilities.parseStatuses(statuses);

      expect(parsedStatuses).to.be.an('object');
      expect(parsedStatuses).to.not.include.keys('commit1');
    });

    it('should parse all other statuses besides pending', function() {
      var statuses = [
        new Status('commit1', 'pending'),
        new Status('commit2', 'success'),
        new Status('commit3', 'error'),
        new Status('commit4', 'failed')
      ];

      var parsedStatuses = utilities.parseStatuses(statuses);

      expect(parsedStatuses).to.be.an('object');
      expect(parsedStatuses).to.include.keys(
        'commit2',
        'commit3',
        'commit4'
      );
    });
  });

  describe('mergeBasePRData - recollect basic pull request data', function() {
    it('should create a PR entry if not exists', function() {
      var eventData = require('./stubs/eventData.mock');
      var pullRequestsObject = {};

      utilities.mergeBasePRData(pullRequestsObject, eventData);

      var expectedId = 'Kibibit/achievibit/pull/1';
      expect(pullRequestsObject[expectedId]).to.be.an('object');
      expect(pullRequestsObject[expectedId]).to.include.keys(
        'id',
        '_id', // ??
        'url',
        'number',
        'title',
        'description',
        'creator',
        'createdOn',
        'labels',
        'history',
        'repository'
      );
    });

    it('should merge new data if old data exist', function() {
      var eventData = require('./stubs/eventData.mock');
      var pullRequestsObject = {
        'Kibibit/achievibit/pull/1': {
          'id': 'Kibibit/achievibit/pull/1',
          'url': 'nice',
          'number': 1,
          'title': 'old_title',
          'description': 'old_description',
        }
      };

      utilities.mergeBasePRData(pullRequestsObject, eventData);

      var expectedId = 'Kibibit/achievibit/pull/1';
      expect(pullRequestsObject[expectedId]).to.be.an('object');
      expect(pullRequestsObject[expectedId]).to.include.keys(
        'id',
        '_id', // ??
        'url',
        'number',
        'title',
        'description',
        'creator',
        'createdOn',
        'labels',
        'history',
        'repository'
      );
    });
  });

  describe('initializePullRequest - get all basic data from event', function() {
    it('should return the correct data', function() {
      var eventData = require('./stubs/eventData.mock');

      var pullRequest = utilities.initializePullRequest(eventData);
      expect(pullRequest).to.be.an('object');
      expect(pullRequest).to.include.keys(
        'id',
        '_id', // ??
        'url',
        'number',
        'title',
        'description',
        'creator',
        'createdOn',
        'labels',
        'history',
        'repository'
      );
      expect(pullRequest).to.not.include.keys('organization', 'reviewers');
    });

    it('should have organization associated if found', function() {
      var eventData = require('./stubs/eventData.mock');

      eventData.repository.owner.type = 'Organization';

      var pullRequest = utilities.initializePullRequest(eventData);
      expect(pullRequest).to.be.an('object');
      expect(pullRequest).to.include.keys('organization');
    });

    it('should have assignees if found', function() {
      var eventData = require('./stubs/eventData.mock');

      eventData.pull_request.assignees = [];
      eventData.pull_request.assignees.push({
        'login': 'Thatkookooguy',
        'avatar_url': 'https://avatars.githubusercontent.com/u/10427304?v=3',
        'html_url': 'https://github.com/Thatkookooguy',
      });

      var pullRequest = utilities.initializePullRequest(eventData);
      expect(pullRequest).to.be.an('object');
      expect(pullRequest).to.include.keys('reviewers');
    });
  });
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

function Status(context, state) {
  return {
    'state': state || 'pending',
    'description': 'description yo',
    'target': 'url',
    'context': context || 'commit'
  };
}
