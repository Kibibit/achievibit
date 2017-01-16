var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var github = require('octonode');
var request = require('request');
var schema = require('js-schema');
var async = require("async");
var achievibitDB = require('./achievibitDB');
var utilities = require('./utilities');
var nconf = require('nconf');

nconf.argv().env();

// require all the achievement files
var achievements = require('require-all')({
  dirname     :  __dirname + '/achievements',
  filter      :  /(.+achievement)\.js$/,
  excludeDirs :  /^\.(git|svn)$/,
  recursive   : true
});

var client = github.client({
  username: nconf.get('githubUser'),
  password: nconf.get('githubPassword')
});

// OUR SCHEMAS!
var Achievement = schema({
  avatar : String,
  name : String,
  short : String,
  description : String,
  relatedPullRequest: String
});

var Treasure = schema({
  name : String,
  gem : [String, Number, Boolean]
});

var pullRequests = {};

var EventManager = function() {
    var self = this;

    self.notifyAchievements = function(githubEvent, eventData, io) {
        /**
         * NEW REPO CONNECTED!!!
         */
        if (_.isEqual(githubEvent, 'ping')) {
            var repo = utilities.parseRepo(eventData.repository);

            if (utilities.isPullRequestAssociatedWithOrganization(eventData)) {
                repo.organization = utilities.parseUser(eventData.repository.owner, true);
            }

            achievibitDB.insertItem('repos', repo);
        }

        /**
         * INIT PULL REQUEST DATA
         * This will allow us to notify the achievements if something changed
         * in case some achievements want to deal with changing things.
         * notice that labels are given as a different event with the same
         * time, so that way we know if that was an added label at creation
         * or later
         */
        if (_.isEqual(githubEvent, 'pull_request') &&
            _.isEqual(eventData.action, 'opened')) { //_.isEqual(eventData.action, 'reopened')
            /////
            var id = utilities.getPullRequestIdFromEventData(eventData);

            //var pullRequests = db.get('pullRequests');
            if (!pullRequests[id]) {
                pullRequests[id] = {};
            }
            _.merge(pullRequests[id], utilities.initializePullRequest(eventData));

            if (utilities.isPullRequestAssociatedWithOrganization(eventData)) {
                pullRequests[id].organization = utilities.parseUser(eventData.repository.owner, true);
            }

            if (eventData.pull_request.assignees) {
                var assignees = eventData.pull_request.assignees;
                pullRequests[id].reviewers = [];
                for (var i = 0; i < assignees.length; i++) {
                    pullRequests[id].reviewers.push(utilities.parseUser(assignees[i]));
                }
            }

            console.log('created new pull request object', JSON.stringify(pullRequests[id], null, 2));
        }

        /**
         * INIT PULL REQUEST DATA - LABELS
         * This event means a label was added on creation.
         * Therefore, we'll add that to the pull request without
         * adding an update event
         */
        if (_.isEqual(githubEvent, 'pull_request') &&
            _.isEqual(eventData.action, 'labeled') &&
            _.isEqual(
                eventData.pull_request.updated_at,
                eventData.pull_request.created_at)
            ) {
            /////
            var id = utilities.getPullRequestIdFromEventData(eventData);
            pullRequests[id]
                .labels.push(eventData.label.name);

            console.log('added labels on creation', JSON.stringify(pullRequests[id], null, 2));

        /**
         * UPDATE PULL REQUEST DATA - LABEL ADDED
         */
        } else if (_.isEqual(githubEvent, 'pull_request') &&
            _.isEqual(eventData.action, 'labeled')) {
            /////
            var id = utilities.getPullRequestIdFromEventData(eventData);
            if (!_.isObject(pullRequests[id].history.labels)) {
                pullRequests[id].history.labels = {
                    added: 0,
                    removed: 0
                };
            }

            pullRequests[id].history.labels.added++;

            pullRequests[id]
                .labels.push(eventData.label.name);

            console.log('UPDATE labels', JSON.stringify(pullRequests[id], null, 2));
        }

        /**
         * UPDATE PULL REQUEST DATA - LABEL REMOVED
         */
        if (_.isEqual(githubEvent, 'pull_request') &&
            _.isEqual(eventData.action, 'unlabeled')) {
            /////
            var id = utilities.getPullRequestIdFromEventData(eventData);
            if (!_.isObject(pullRequests[id].history.labels)) {
                pullRequests[id].history.labels = {
                    added: 0,
                    removed: 0
                };
            }

            pullRequests[id].history.labels.removed++;

            var removedItems = _.remove(pullRequests[id].labels, function(label) {
              return _.isEqual(label, eventData.label.name);
            });

            console.log('UPDATE labels - removed ', JSON.stringify(removedItems, null, 2));
            console.log('UPDATE labels', JSON.stringify(pullRequests[id], null, 2));
        }

        /**
         * PULL REQUEST ACHIEVEMENTS EVENTS
         * Send correct events based on data
         * so achievements can listen and UNLOCK if
         * data matched what they looked for
         */
        if (_.isEqual(githubEvent, 'pull_request') &&
            _.isEqual(eventData.action, 'closed') &&
            eventData.pull_request.merged) {
            // this is the time to give achievements!
            // need to create a dataObject that I can give here
            // that will include all important changes.
            // those are:
            // * log edits to pull request info (title, body, labels)
            // * log comments data so we can give achievements based on comments?
            // * log status updates (can give achievements on flawless builds, etc.)
            // Those will be logged here by other "ifs", and this if will trigger all
            // the relevant events based on that data

            // first, get some additional data:
            //  * comments
            //  * reactions
            var id = utilities.getPullRequestIdFromEventData(eventData);

            // if by any chance we missed creating the pull request,
            // create it here (means we won't have history)
            if (!pullRequests[id]) {
                pullRequests[id] = {};
            }

            // update to latest info for some things
            _.assign(pullRequests[id], {
                _id: id,
                id: id,
                url: eventData.pull_request.html_url,
                number: eventData.number,
                title: eventData.pull_request.title,
                description: eventData.pull_request.body,
                creator: utilities.parseUser(eventData.pull_request.user),
                createdOn: eventData.pull_request.created_at,
                repository: {
                    name: eventData.repository.name,
                    fullname: eventData.repository.full_name,
                    url: eventData.repository.html_url
                }
            });
            var ghpr = client.pr(eventData.repository.full_name, eventData.number);
            var ghissue = client.issue(eventData.repository.full_name, eventData.number);
            var ghrepo = client.repo(eventData.repository.full_name);

            async.parallel([
                function fetchPRComments(callback) {
                  ghissue.comments(function(err, comments) {
                    if (err) {
                      callback(err);
                      return;
                    }

                    pullRequests[id].comments = [];
                    var reactionsRequests = [];

                    _.forEach(comments, function(comment) {
                        var commentParsed = {
                        author: utilities.parseUser(comment.user),
                        message: comment.body,
                        createdOn: comment.created_at,
                        edited: !_.isEqual(comment.created_at, comment.updated_at),
                        apiUrl: comment.url
                      };
                      pullRequests[id].comments.push(commentParsed);

                      reactionsRequests.push(getReactions(commentParsed));
                    });

                    async.parallel(reactionsRequests, function(err, results) {
                        if (err) {
                          callback(err);
                          return;
                        }
                        callback(null, 'comments & reactions fetched');
                    });
                  });
                },
                function fetchInlineComments(callback) {
                  ghpr.comments(function(err, inlineComments) {
                      if (err) {
                        callback(err);
                        return;
                      }

                      pullRequests[id].inlineComments = [];
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
                         pullRequests[id].inlineComments.push(inlineCommentParsed);
                         reactionsRequests.push(getReactions(inlineCommentParsed));
                      });

                      async.parallel(reactionsRequests, function(err, results) {
                          if (err) {
                            callback(err);
                            return;
                          }
                          callback(null, 'inline comments & reactions fetched');
                      });
                  });
                },
                function fetchCommits(callback) {
                  ghpr.commits(function(err, commits) {
                    if (err) {
                      callback(err);
                      return;
                    }

                      pullRequests[id].commits = [];
                      _.forEach(commits, function(commit) {
                          ghrepo.statuses(commit.sha, function(err, statuses) {
                              pullRequests[id].commits.push({
                                sha: commit.sha,
                                author: utilities.parseUser(commit.author),
                                committer: utilities.parseUser(commit.committer),
                                message: commit.commit.message,
                                commentCount: commit.comments,
                                statuses: utilities.parseStatuses(statuses)
                             });
                          });
                      });

                      callback(null, 'commits fetched');
                  });
                },
                function fetchPRFiles(callback) {
                  ghpr.files(function(err, files) {
                    if (err) {
                      callback(err);
                      return;
                    }

                      pullRequests[id].files = [];
                      _.forEach(files, function(file) {
                          pullRequests[id].files.push({
                              content: getNewFileFromPatch(file.patch),
                              name: file.filename
                          });
                      });

                      callback(null, 'files fetched');
                  });
                }
            ], function(err, results) {
                console.log('got all async data. continuing...');
                dataReady(id, io);
            });
        }

        /**
         * UPDATE PULL REQUEST DATA - PULL REQUEST EDITED
         * This means something changed:
         *  * title
         *  * description
         */
        if (_.isEqual(githubEvent, 'pull_request') &&
            _.isEqual(eventData.action, 'edited')) {
            /////
            var id = utilities.getPullRequestIdFromEventData(eventData);
            if (eventData.changes.title) {
                var oldTitle = pullRequests[id].title;

                if (!_.isArray(pullRequests[id].history.title)) {
                    pullRequests[id].history.title = [];
                }

                pullRequests[id].history.title.push({
                    changedOn: eventData.pull_request.updated_at,
                    title: oldTitle
                });

                pullRequests[id].title = eventData.pull_request.title;

                console.log('UPDATE title', JSON.stringify(pullRequests[id], null, 2));
            }

            if (eventData.changes.body) {
                var oldDescription = pullRequests[id].description;

                if (!_.isArray(pullRequests[id].history.description)) {
                    pullRequests[id].history.description = [];
                }

                pullRequests[id].history.description.push({
                    changedOn: eventData.pull_request.updated_at,
                    description: oldDescription
                });

                pullRequests[id].description = eventData.pull_request.body;

                console.log('UPDATE description', JSON.stringify(pullRequests[id], null, 2));
            }

        }

        /**
         * UPDATE PULL REQUEST DATA - ASSIGNEES CHANGED
         * Currently, we don't log this change. But we can do that if we'll have some ideas
         * for achievemenets for that :-)
         */
        if (_.isEqual(githubEvent, 'pull_request') &&
            (_.isEqual(eventData.action, 'unassigned') || _.isEqual(eventData.action, 'assigned'))) {
            /////
            var id = utilities.getPullRequestIdFromEventData(eventData);
            if (!pullRequests[id]) {
                pullRequests[id] = {};
            }
            var assignees = eventData.pull_request.assignees;
            pullRequests[id].reviewers = [];
            for (var i = 0; i < assignees.length; i++) {
                pullRequests[id].reviewers.push(utilities.parseUser(assignees[i]));
            }

            console.log('UPDATE assignees', JSON.stringify(pullRequests[id], null, 2));
        }

        if (_.isEqual(githubEvent, 'pull_request_review_comment') &&
            _.isEqual(eventData.action, 'created')) {
            //self.emit('open', eventData);
        }
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
                callback(err);
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
              } else {
                  console.error('wrong status from server: [' +
                      response.statusCode +
                      '] ' +
                      body);
              }
              callback(null, 'reactions ready');
          });
        };
    }

    function dataReady(id, io) {
            var allUsersUsernames = [];

            console.log('~~== PULL REQUEST MERGED! ==~~');

            // add creator to database
            console.log('adding users to database');
            achievibitDB.insertItem('users', pullRequests[id].creator);
            allUsersUsernames.push({ username: pullRequests[id].creator.username });
            console.log('adding user: ' + pullRequests[id].creator.username);

            // add organization to database
            console.log('adding organization to database');
            if (pullRequests[id].organization) {
                achievibitDB.insertItem('users', pullRequests[id].organization);
                allUsersUsernames.push({ username: pullRequests[id].organization.username });
                console.log('adding user (organization): ' + pullRequests[id].organization.username);
                //addOrganization(pullRequests[id].creator.username, pullRequests[id].organization);
            }

            // add reviewers to database
            _.forEach(pullRequests[id].reviewers, function(reviewer) {
                achievibitDB.insertItem('users', reviewer);
                allUsersUsernames.push({ username: reviewer.username });
                console.log('adding user: ' + reviewer.username);
                //addOrganization(reviewer.username, pullRequests[id].organization);
            });

            console.log('adding repo to database: ' + pullRequests[id].repository.fullname);
            achievibitDB.insertItem('repos', pullRequests[id].repository);

            console.log('~~== CHECKING ACHIEVEMENTS ==~~');

            achievibitDB.findItem('users', {$or: allUsersUsernames}).then(function(users) {
                if (!users) {
                    console.error('couldn\'t find users', allUsersUsernames);
                    return;
                }

                var organization = _.remove(users, 'organization')[0];

                if (organization) {
                    _.forEach(users, function(user) {
                        if (!_.isArray(user.organizations)) {
                            user.organizations = [];
                        }

                        if (!_.find(user.organizations, { username: organization.username })) {
                            user.organizations.push({
                                username: organization.username,
                                url: organization.url,
                                avatar: organization.avatar
                            });
                        }

                        if (!_.isArray(organization.users)) {
                            organization.users = [];
                        }

                        if (!_.find(organization.users, { username: user.username })) {
                            organization.users.push({
                                username: user.username,
                                url: user.url,
                                avatar: user.avatar
                            });
                        }
                    });
                }

                var grantedAchievements = {};

                // check for achievements
                _.forEach(achievements, function(achievement, achievementFilename) {
                    var shall = {
                        grant: function(username, achievementObject) {
                            if (!_.isString(username)) {
                                console.error(achievementFilename +
                                    ': grant should get a username');
                                return;
                            }
                            if (!_.isObject(achievementObject)) {
                                console.error(achievementFilename +
                                    ': grant should get an object');
                                return;
                            }
                            if (Achievement(achievementObject)) {

                                if (!grantedAchievements[username]) {
                                    grantedAchievements[username] = [];
                                }

                                achievementObject.grantedOn = new Date().getTime();
                                io.sockets.emit(username,achievementObject);
                                grantedAchievements[username].push(achievementObject);
                                console.log(username + ' got a new achievement! ' + achievementObject.name);
                            } else {
                                console.error(achievementObject.name || achievementFilename +
                                    ': didn\'t get the correct structure. see documentation');
                                console.log('acievement problems:');
                                console.log(Achievement.errors(achievementObject));
                            }
                        },
                        pass: function(username, treasure) {
                            if (Treasure(treasure)) {
                                // TODO(thatkookooguy): do we need this first call? what happens if there's no user in line 555?
                                achievibitDB.findItem('users', { username: username }).then(function(users) {

                                    var dataObject = {};

                                    dataObject['treasures.' + treasure.name] = treasure.gem;

                                    achievibitDB.updatePartially('users', { username: username }, dataObject);
                                });
                            } else {
                              console.log('Treasure problems:');
                              console.log(Treasure.errors(treasure));
                            }
                        },
                        retrieve: function(username, treasureName) {
                            if (!_.isString(username) || !_.isString(treasureName)) {
                                console.error('retrieve expects a username and a treasure name');
                                return;
                            }
                            return achievibitDB.findItem('users', { username: username }).then(function(users) {
                              var user = users[0];
                              var foundTreasure = user && user.treasures && user.treasures[treasureName];
                              return foundTreasure ? user.treasures[treasureName] : null;
                            });
                        }
                    };
                    achievement.check && achievement.check(pullRequests[id], shall);

                });

                _.forEach(users, function(user) {
                    if (grantedAchievements[user.username]) {

                        if (!user.achievements) {
                            user.achievements = [];
                        }

                        var userAchievements = user.achievements;
                        var newAchievements = _.differenceBy(grantedAchievements[user.username], userAchievements, 'name');
                    }

                    console.log('updating user: ' + user.username);
                    var repositoryName = pullRequests[id].repository ? pullRequests[id].repository.fullname : undefined;
                    var newData = {};
                    if (repositoryName) {
                      newData.repos = repositoryName;
                    }
                    if (newAchievements) {
                      newData.achievements = {
                        $each: newAchievements
                      };
                    }
                    achievibitDB.updatePartialArray('users', user._id, newData);
                });

                if (pullRequests[id].repository) {
                    if (!organization.repos) {
                        organization.repos = [];
                    }

                    if (!_.find(organization.repos, { fullname: pullRequests[id].repository.fullname })) {
                        organization.repos.push(pullRequests[id].repository);
                    }
                }

                achievibitDB.updatePartialArray('users', organization._id, {
                  'repos': pullRequests[id].repository.fullname
                });
            });
    }
};

var eventManager = new EventManager();

module.exports = eventManager;
