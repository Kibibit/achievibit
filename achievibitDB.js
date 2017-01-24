var _ = require('lodash');
var mongo = require('mongodb');
var monk = require('monk');
var nconf = require('nconf');
var async = require("async");
var utilities = require('./utilities');
var github = require('octonode');
var request = require('request');
var client = github.client({
  username: nconf.get('githubUser'),
  password: nconf.get('githubPassword')
});
var console = require('./consoleService')('SERVER', ['magenta', 'inverse'], process.console);

nconf.argv().env();

var url = nconf.get('databaseUrl');
var db = monk(url);

var collections = {
  repos: db.get('repos'),
  users: db.get('users')
};

var achievibitDB = {};

initCollections();

achievibitDB.insertItem = insertItem; // TODO(Thatkookooguy): can be private
achievibitDB.updateItem = updateItem; // TODO(Thatkookooguy): can be private
achievibitDB.findItem = findItem; // NOTE(Thatkookooguy): used in eventManager
achievibitDB.updatePartially = updatePartially; // TODO(Thatkookooguy): can be private ????
achievibitDB.updatePartialArray = updatePartialArray;
achievibitDB.getExtraPRData = getExtraPRData;
achievibitDB.addPRItems = addPRItems;
achievibitDB.connectUsersAndRepos = connectUsersAndRepos;

module.exports = achievibitDB;

function initCollections() {
  collections.repos.index( { fullname: 1 }, { unique: true, sparse: true } );
  collections.repos.index({
    "fullname": "text",
    "organization": "text"
  }, {
    "weights": {
      "fullname": 3,
      "organization": 1
    }
  });
  collections.users.index( { username: 1 }, { unique: true, sparse: true } );
  collections.users.index({
    "username": "text",
    "repos": "text",
    "organizations": "text"
  }, {
    "weights": {
      "username": 3,
      "repos": 1,
      "organizations": 1
    }
  });
}

function insertItem(collection, item) {
  if (_.isNil(collection) || _.isNil(item)) return;
  return collections[collection].insert(item)
    .then(function() {
      console.info('insertItem success', collection, item);
    }, function(error) {
      console.error('insertItem got an error', error);
    });
}

function updateItem(collection, identityObject, updateWith) {
  if (_.isNil(collection) || _.isNil(identityObject) || _.isNil(updateWith)) {
    return;
  }

  return collections[collection].update(identityObject, updateWith)
    .then(function() {
      console.info('updateItem success', collection, identityObject, updateWith);
    }, function(error) {
      console.error('updateItem got an error', error);
    });
}

function updatePartially(collection, identityObject, updatePartial) {
  if (_.isNil(collection) || _.isNil(identityObject) || _.isNil(updatePartial)) {
    return;
  }

  return collections[collection].update(identityObject, {
    $set: updatePartial
  }).then(function() {
    console.info('updatePartially success', collection, identityObject, updatePartial);
  }, function(error) {
    console.error('updatePartially got an error', error);
  });
}

function updatePartialArray(collection, identityObject, updatePartial) {
  if (_.isNil(collection) || _.isNil(identityObject) || _.isNil(updatePartial)) {
    return;
  }

  return collections[collection].update(identityObject, {
    $addToSet: updatePartial
  }).then(function(data) {
    console.info('updatePartialArray wroked!', data);
  }, function(error) {
    console.error('updatePartialArray got an error', error);
  });
}

function findItem(collection, identityObject) {
  if (_.isNil(collection) || _.isNil(identityObject)) return;
  return collections[collection].find(identityObject).then(function(item) {
    return item;
  }, function(error) {
    console.error('findItem got an error', error);
  });
}

function addPRItems(pullRequest, givenCallback) {
  async.parallel([
    function insertOrganization(callback) {
      if (pullRequest.organization) {
          insertItem('users', pullRequest.organization).then(
            function(data) {
              callback(null, 'organization added');
            }, function(error) {
              console.error(error);
              callback(null, 'organization existed?');
            }
          );
      } else {
        callback('no organization to add');
      }
    }, function insertPRCreator(callback) {
      console.log('adding PR creator to database');
      insertItem('users', pullRequest.creator)
        .then(function(data) {
          callback(null, 'PR creator added');
        }, function(error) {
          console.error(error);
          callback(null, 'PR creator existed?');
        });
    }, function insertReviewers(callback) {
      var allReviewersUsernames = _.map(pullRequest.reviewers, 'username');

      if (pullRequest.reviewers && pullRequest.reviewers.length > 0) {
        insertItem('users', pullRequest.reviewers)
          .then(function(data) {
            callback(null, 'reviewers added');
          }, function(error) {
            console.error(error);
            callback(null, 'reviewers existed?!');
          });
      } else {
        callback(null, 'no reviewers to add');
      }
    },
    function insertRepo(callback) {
      var repo = _.clone(pullRequest.repository);
      if (pullRequest.organization) {
        repo.organization = pullRequest.organization.username
      }
      console.log('adding repo to database: ' + pullRequest.repository.fullname);
      insertItem('repos', repo)
        .then(function(data) {
          callback(null, 'repo added');
        }, function(error) {
          console.error(error);
          callback(null, 'repo existed?');
        });
    }
  ], function(err, results) {
    console.info('PR items added to DB', {
      err: err,
      results: results
    });

    connectUsersAndRepos(pullRequest, givenCallback);
  });
}

function connectUsersAndRepos(pullRequest, givenCallback) {
  console.info('Connecting PR items');
  var repoDataForUsers = {
    repos: pullRequest.repository.fullname
  };

  var organizationDataForUsers;

  if (pullRequest.organization) {
    organizationDataForUsers = {
      organizations: pullRequest.organization.username
    }
  }

  var usersInPullRequest = _.map(pullRequest.reviewers, 'username').concat([pullRequest.creator.username]);

  async.parallel([
    function addRepoToCreator(callback) {
      updatePartialArray('users', {
        username: pullRequest.creator.username
      }, repoDataForUsers).then(function() {
        callback(null, 'connected creator with repo');
      }, function(error) {
        callback(error, 'had a problem connecting creator with repo');
      });
    },
    function addOrganizationToCreator(callback) {
      if (organizationDataForUsers) {
        updatePartialArray('users', {
          username: pullRequest.creator.username
        }, organizationDataForUsers).then(function() {
          callback(null, 'connected creator to organization');
        }, function(error) {
          callback(error, 'had a problem connecting creator with organization');
        });
      } else {
        callback(null, 'no organization to connect to creator');
      }
    },
    function addRepoToReviewers(callback) {
      var allReviewersRequests = [];
      var allReviewersUsernames = _.map(pullRequest.reviewers, 'username');
      var createSingleUserRequest = function(username) {
        return function singleReviewerRepo(singleUserCallback) {
          updatePartialArray('users', {
            username: username
          }, repoDataForUsers).then(function(data) {
            singleUserCallback(null, 'connected reviewer ' + username + ' with repo');
          }, function(error) {
            singleUserCallback(error, 'error connecting reviewer' + username + ' to repo');
          });
        }
      }

      if (allReviewersUsernames && allReviewersUsernames.length > 0) {
        _.forEach(allReviewersUsernames, function(username) {
          allReviewersRequests.push(createSingleUserRequest(username));
        });

        async.parallel(allReviewersRequests, function(err, results) {
          callback(err, results);
        });
      } else {
        callback(null, 'no reviewers to connect to repo');
      }

    },
    function addOrganizationToReviewers(callback) {
      var allReviewersRequests = [];
      var allReviewersUsernames = _.map(pullRequest.reviewers, 'username');

      if (organizationDataForUsers && allReviewersRequests.length > 0) {

        var createSingleUserRequest = function(username) {
          return function singleReviewerOrganization(singleUserCallback) {
            updatePartialArray('users', {
              username: username
            }, organizationDataForUsers).then(function() {
              singleUserCallback(null, 'repo added to reviewer ' + username);
            }, function(error) {
              singleUserCallback(error, 'error connecting reviewer' + username + ' to organization');
            });
          }
        };

        _.forEach(allReviewersUsernames, function(username) {
          allReviewersRequests.push(createSingleUserRequest(username));
        });

        async.parallel(allReviewersRequests, function(err, results) {
          callback(err, results);
        });
      } else {
        callback(null, allReviewersRequests.length === 0 ?
          'no reviewers to connect organization to' :
          'no organization to connect reviewers to'
        );
      }
    },
    function addUsersToOrganization(callback) {
      if (pullRequest.organization) {
        updatePartialArray('users', {
          username: pullRequest.organization.username
        }, usersInPullRequest).then(function(data) {
          callback(null, 'PR users added to organization');
        }, function(error) {
          callback(error, 'PR users had a problem connection with organization');
        });
      } else {
        callback(null, 'no organization to connect users to');
      }
    }
  ], function(err, results) {
    console.info('finished connecting users and repos to each other', err, results);

    if (_.isFunction(givenCallback)) {
      givenCallback(err, results);
    }
  });
}

function getExtraPRData(pullRequest, givenCallback) {
  var ghpr = client.pr(pullRequest.repository.fullname, pullRequest.number);
  var ghissue = client.issue(pullRequest.repository.fullname, pullRequest.number);
  var ghrepo = client.repo(pullRequest.repository.fullname);

  async.parallel([
      function fetchPRComments(callback) {
        ghissue.comments(function(err, comments) {
          if (err) {
            callback(err, 'had a problem adding comments');
            return;
          }

          pullRequest.comments = [];
          var reactionsRequests = [];

          _.forEach(comments, function(comment) {
              var commentParsed = {
              author: utilities.parseUser(comment.user),
              message: comment.body,
              createdOn: comment.created_at,
              edited: !_.isEqual(comment.created_at, comment.updated_at),
              apiUrl: comment.url
            };
            pullRequest.comments.push(commentParsed);

            reactionsRequests.push(getReactions(commentParsed));
          });

          async.parallel(reactionsRequests, function(err, results) {
              if (err) {
                callback(err, 'had a problem getting reactions');
                return;
              }
              callback(null, 'comments & reactions fetched');
          });
        });
      },
      function fetchInlineComments(callback) {
        ghpr.comments(function(err, inlineComments) {
            if (err) {
              callback(err, 'had a problem getting inline comments');
              return;
            }

            pullRequest.inlineComments = [];
            var reactionsRequests = [];

            _.forEach(inlineComments, function(inlineComment) {
                var inlineCommentParsed = {
                file: inlineComment.path,
                author: utilities.parseUser(inlineComment.user),
                message: inlineComment.body,
                createdOn: inlineComment.created_at,
                edited: !_.isEqual(inlineComment.created_at, inlineComment.updated_at),
                commit: inlineComment.commit_id,
                apiUrl: inlineComment.url

               };
               pullRequest.inlineComments.push(inlineCommentParsed);
               reactionsRequests.push(getReactions(inlineCommentParsed));
            });

            async.parallel(reactionsRequests, function(err, results) {
                if (err) {
                  callback(err, 'had a problem getting reactions for inline comments');
                  return;
                }
                callback(null, 'inline comments & reactions fetched');
            });
        });
      },
      function fetchCommits(callback) {
        ghpr.commits(function(err, commits) {
          if (err) {
            callback(err, 'had a problem getting PR commits');
            return;
          }

            pullRequest.commits = [];
            _.forEach(commits, function(commit) {
                ghrepo.statuses(commit.sha, function(err, statuses) {
                    pullRequest.commits.push({
                      sha: commit.sha,
                      author: utilities.parseUser(commit.author),
                      committer: utilities.parseUser(commit.committer),
                      message: commit.commit.message,
                      commentCount: commit.comments,
                      statuses: utilities.parseStatuses(statuses)
                   });

                   if (commits.indexOf(commit) === commits.length - 1) {
                     callback(null, 'commits fetched');
                   }
                });
            });
        });
      },
      function fetchPRFiles(callback) {
        ghpr.files(function(err, files) {
          if (err) {
            callback(err, 'had a problem getting PR files');
            return;
          }

            pullRequest.files = [];
            _.forEach(files, function(file) {
                pullRequest.files.push({
                    content: getNewFileFromPatch(file.patch),
                    name: file.filename
                });
            });

            callback(null, 'files fetched');
        });
      }
  ], function(err, results) {
      console.log('Got all extra PR data', err, results);
      if (_.isFunction(givenCallback)) {
        givenCallback(err, results);
      }
  });
}

function getReactions(comment) {
    return function getSpecificCommentReactions(callback) {
      request({
          url: comment.apiUrl + '/reactions',
          headers: {
              'Accept': 'application/vnd.github.squirrel-girl-preview',
              'User-Agent': 'achievibit'
          }
      }, function(err, response, body) {
          if (err) {
            callback(err, 'had a problem getting reaction');
            return;
          }

          if (response.statusCode == 200) {

              var reactions = JSON.parse(body);
              comment.reactions = [];
              _.forEach(reactions, function(reaction) {
                  comment.reactions.push({
                      reaction: reaction.content,
                      user: utilities.parseUser(reaction.user)
                  });
              });

              callback(null, 'reactions ready');
          } else {
              console.error('wrong status from server: [' +
                  response.statusCode +
                  '] ' +
                  body);
              callback(comment.apiUrl, 'reactions had a problem');
          }
      });
    };
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
