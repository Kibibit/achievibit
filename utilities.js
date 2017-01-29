var _ = require('lodash');

var utilities = {};

utilities.parseStatuses = parseStatuses;
utilities.parseUser = parseUser;
utilities.getNewFileFromPatch = getNewFileFromPatch;
utilities.getPullRequestIdFromEventData = getPullRequestIdFromEventData;
utilities.parseRepo = parseRepo;
utilities.isPullRequestAssociatedWithOrganization =
  isPullRequestAssociatedWithOrganization;
utilities.initializePullRequest = initializePullRequest;
utilities.mergeBasePRData = mergeBasePRData;

module.exports = utilities;

function isPullRequestAssociatedWithOrganization(eventData) {
  return _.isEqual(eventData.repository.owner.type, 'Organization');
}

function initializePullRequest(eventData) {
  var id = utilities.getPullRequestIdFromEventData(eventData);
  var pullRequest = {
    _id: id,
    id: id,
    url: eventData.pull_request.html_url,
    number: eventData.number,
    title: eventData.pull_request.title,
    description: eventData.pull_request.body,
    creator: utilities.parseUser(eventData.pull_request.user),
    createdOn: eventData.pull_request.created_at,
      //milestone: eventData.pull_request.milestone,
    labels: [],
    history: {},
    repository: utilities.parseRepo(eventData.repository)
  };

  if (utilities.isPullRequestAssociatedWithOrganization(eventData)) {
    pullRequest.organization =
      utilities.parseUser(eventData.repository.owner, true);
  }

  if (eventData.pull_request.assignees) {
    var assignees = eventData.pull_request.assignees;
    pullRequest.reviewers = [];
    for (var i = 0; i < assignees.length; i++) {
      pullRequest.reviewers.push(utilities.parseUser(assignees[i]));
    }
  }

  return pullRequest;
}

function parseRepo(repository) {
  return {
    name: repository.name,
    fullname: repository.full_name,
    url: repository.html_url
  };
}

function parseStatuses(statuses) {
  var parsed = {};
  _.forEach(statuses, function(status) {
        // nothing should be pending if the pull request got merged
    if (!_.isEqual(status.state, 'pending')) {
      parsed[status.context] = {
        state: status.state,
        description: status.description,
        target: status.target_url,
        context: status.context
      };
    }
  });

  return parsed;
}

function parseUser(githubUser, isOrganization) {
  var user = {
    username: githubUser.login,
    url: githubUser.html_url,
    avatar: githubUser.avatar_url
  };

  if (isOrganization) {
    user.organization = true;
  }

  return user;
}

function getNewFileFromPatch(patch) {
  if (!patch) {
    return;
  }
  return patch.split('\n').filter(function(line) {
    return !line.startsWith('-') &&
    !line.startsWith('@') &&
    line.indexOf('No newline at end of file') === -1;

  }).map(function(line) {
    if (line.startsWith('+'))            {return line.replace('+', '');}
    return line;
  }).join('\n');
}

function getPullRequestIdFromEventData(eventData) {
  return eventData.repository.full_name + '/pull/' + eventData.number;
}

function mergeBasePRData(pullRequestsObject, eventData) {
  var id = getPullRequestIdFromEventData(eventData);

  if (!pullRequestsObject[id]) {
    pullRequestsObject[id] = {};
  }
  _.assign(pullRequestsObject[id], utilities.initializePullRequest(eventData));
}
