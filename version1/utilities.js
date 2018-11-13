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
utilities.parseReviewStatus = parseReviewStatus;
utilities.parseComment = parseComment;
utilities.parseReviewComment = parseReviewComment;

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
    pullRequest.assignees = [];
    for (var i = 0; i < assignees.length; i++) {
      pullRequest.assignees.push(utilities.parseUser(assignees[i]));
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

function parseComment(comment, isInlineComment) {
  var commentObject = {
    author: utilities.parseUser(comment.user),
    message: comment.body,
    createdOn: comment.created_at,
    edited: !_.isEqual(comment.created_at, comment.updated_at),
    apiUrl: comment.url
  };

  if (isInlineComment) {
    commentObject.file = comment.path;
    commentObject.commit = comment.commit_id;
    commentObject.apiUrl = comment.url;
  }

  return commentObject;
}

function parseReviewComment(comment) {
  var commentObject = {
    id: comment.id,
    reviewId: comment.pull_request_review_id,
    author: utilities.parseUser(comment.user),
    message: comment.body,
    createdOn: comment.created_at,
    edited: !_.isEqual(comment.created_at, comment.updated_at),
    apiUrl: comment.url,
    file: comment.path,
    commit: comment.commit_id
  };

  return commentObject;
}

function parseReviewStatus(review) {
  return {
    id: review.id,
    user: parseUser(review.user),
    message: review.body || '',
    state: review.state,
    createdOn: review.submitted_at,
    commit: review.commit_id
  };
}

function parseStatuses(statuses) {
  var parsed = {};
  _.forEach(statuses, function(status) {
    // nothing should be pending if the pull request got merged
    // TODO(Thatkookooguy): check if this assumption is true
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
    if (line.startsWith('+')) {
      return line.replace('+', '');
    }

    return line;
  }).join('\n');
}

function getPullRequestIdFromEventData(eventData) {
  return [
    eventData.repository.full_name,
    '/pull/',
    eventData.pull_request.number
  ].join('');
}

function mergeBasePRData(pullRequestsObject, eventData) {
  var id = getPullRequestIdFromEventData(eventData);

  if (!pullRequestsObject[id]) {
    pullRequestsObject[id] = {};
  }

  var newData = utilities.initializePullRequest(eventData);

  _.assign(pullRequestsObject[id], newData);
}
