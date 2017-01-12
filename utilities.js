var _ = require('lodash');

var utilities = {};

utilities.parseStatuses = parseStatuses;
utilities.parseUser = parseUser;
utilities.getNewFileFromPatch = getNewFileFromPatch;
utilities.getPullRequestIdFromEventData = getPullRequestIdFromEventData;
utilities.parseRepo = parseRepo;
utilities.isPullRequestAssociatedWithOrganization = isPullRequestAssociatedWithOrganization;
utilities.initializePullRequest = initializePullRequest;

module.exports = utilities;

function isPullRequestAssociatedWithOrganization(eventData) {
  return _.isEqual(eventData.repository.owner.type, 'Organization');
}

function initializePullRequest(eventData) {
  return {
      id: utilities.getPullRequestIdFromEventData(eventData),
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
        return !line.startsWith('-') && !line.startsWith('@') && line.indexOf('No newline at end of file') === -1;
    }).map(function(line) {
        if (line.startsWith('+'))
            return line.replace('+', '');
        return line;
    }).join('\n');
}

function getPullRequestIdFromEventData(eventData) {
    return eventData.repository.full_name + '/pull/' + eventData.number;
}
