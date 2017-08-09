var _ = require('lodash');
var colors = require('colors');
var schema = require('js-schema');
var achievibitDB = require('./achievibitDB');
var utilities = require('./utilities');
var async = require('async');
var console = require('./app/models/consoleService')();
var nconf = require('nconf');

nconf.argv().env();

// require all the achievement files
var achievements = require('require-all')({
  dirname: __dirname + '/achievements',
  filter: /(.+achievement)\.js$/,
  excludeDirs: /^\.(git|svn)$/,
  recursive: true
});

// OUR SCHEMAS!
var Achievement = schema({
  avatar: String,
  name: String,
  short: String,
  description: String,
  relatedPullRequest: String
});

var Treasure = schema({
  name: String,
  gem: [String, Number, Boolean]
});

// all currently open pull requests
var pullRequests = {};

var EventManager = function() {
  var self = this;

  self.postFromWebhook = function(req, res) {
    console.log('got a post about ' + req.header('X-GitHub-Event'));

    self.notifyAchievements(req.header('X-GitHub-Event'), req.body, io);

    res.json({
      message: 'b33p b33p! got your notification, githubot!'
    });
  };

  self.notifyAchievements = function(githubEvent, eventData, io) {
    /**
     * NEW REPO CONNECTED!!!
     * a repo added achievibit as a GitHub webhook!
     */
    if (_.isEqual(githubEvent, 'ping')) {
      var repo = utilities.parseRepo(eventData.repository);

      if (utilities.isPullRequestAssociatedWithOrganization(eventData)) {
        repo.organization =
          utilities.parseUser(eventData.repository.owner, true).username;
      }

      achievibitDB.insertItem('repos', repo);
    }

    /**
     * INIT PULL REQUEST DATA
     * Get the data as it was when the pull request opened.
     * This will allow us to notify the achievements if something changed
     * in case some achievements want to deal with changing things.
     * notice that labels are given as a different event with the same
     * time, so that way we know if that was an added label at creation
     * or later
     */
    if (_.isEqual(githubEvent, 'pull_request') &&
            //_.isEqual(eventData.action, 'reopened') ?
            _.isEqual(eventData.action, 'opened')) {

      utilities.mergeBasePRData(pullRequests, eventData);

      var id = utilities.getPullRequestIdFromEventData(eventData);

      console.log([
        'created new ',
        colors.bgBlue.white.bold('pull request'),
        ' object'
      ].join(''), pullRequests[id]);
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

      console.log('added labels on creation', pullRequests[id]);

    /**
     * UPDATE PULL REQUEST DATA - LABEL ADDED
     */
    } else if (_.isEqual(githubEvent, 'pull_request') &&
            _.isEqual(eventData.action, 'labeled')) {
            /////
      var id = utilities.getPullRequestIdFromEventData(eventData);
      pullRequests[id].history =
        pullRequests[id].history || {};

      if (!_.isObject(pullRequests[id].history.labels)) {
        pullRequests[id].history.labels = {
          added: 0,
          removed: 0
        };
      }

      pullRequests[id].history.labels.added++;

      pullRequests[id]
                .labels.push(eventData.label.name);

      console.log('UPDATE labels', pullRequests[id]);
    }

    /**
     * UPDATE PULL REQUEST DATA - LABEL REMOVED
     */
    if (_.isEqual(githubEvent, 'pull_request') &&
            _.isEqual(eventData.action, 'unlabeled')) {
            /////
      var id = utilities.getPullRequestIdFromEventData(eventData);
      pullRequests[id].history =
        pullRequests[id].history || {};

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

      console.log('UPDATE labels - removed', removedItems);
      console.log('UPDATE labels', pullRequests[id]);
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
      pullRequests[id].history =
        pullRequests[id].history || {};

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

        console.log('UPDATE title', pullRequests[id]);
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

        console.log('UPDATE description', pullRequests[id]);
      }

    }

    /**
     * UPDATE PULL REQUEST DATA - ASSIGNEES CHANGED
     * Currently, we don't log this change. But we can do that if we'll
     * have some ideas for achievemenets for that :-)
     */
    if (_.isEqual(githubEvent, 'pull_request') &&
            (_.isEqual(eventData.action, 'unassigned') ||
            _.isEqual(eventData.action, 'assigned'))) {
            /////
      var id = utilities.getPullRequestIdFromEventData(eventData);
      if (!pullRequests[id]) {
        pullRequests[id] = {};
      }
      var assignees = eventData.pull_request.assignees;
      pullRequests[id].assignees = [];
      for (var i = 0; i < assignees.length; i++) {
        pullRequests[id].assignees.push(utilities.parseUser(assignees[i]));
      }

      console.log('UPDATE assignees', pullRequests[id]);
    }

    // CODE REVIEW

    /**
     * UPDATE PULL REQUEST DATA - REVIEWER ADDED (review request)
     */
    if (_.isEqual(githubEvent, 'pull_request') &&
            _.isEqual(eventData.action, 'review_requested')) {

      var id = utilities.getPullRequestIdFromEventData(eventData);

      utilities.mergeBasePRData(pullRequests, eventData);
      var reviewer = utilities.parseUser(eventData.requested_reviewer);


      if (!pullRequests[id].reviewers) {
        pullRequests[id].reviewers = [];
      }

      pullRequests[id].reviewers.push(reviewer);
      pullRequests[id].reviewers =
        _.uniqBy(pullRequests[id].reviewers, 'username');
      console.log('ADDED REVIEWER', pullRequests[id]);
    }

    /**
     * UPDATE PULL REQUEST DATA - REVIEWER REMOVED
     * Can we know who removed the reviewer?
     */
    if (_.isEqual(githubEvent, 'pull_request') &&
            _.isEqual(eventData.action, 'review_request_removed')) {

      utilities.mergeBasePRData(pullRequests, eventData);
      var id = utilities.getPullRequestIdFromEventData(eventData);

      pullRequests[id].history =
        pullRequests[id].history || {};

      var removedReviewer = utilities.parseUser(eventData.requested_reviewer);


      if (!pullRequests[id].reviewers) {
        pullRequests[id].reviewers = [];
      } else {
        var userToRemove = _.find(pullRequests[id].reviewers, {
          username: removedReviewer.username
        });

        pullRequests[id].reviewers =
          _.without(pullRequests[id].reviewers, userToRemove);

        // manage history
        pullRequests[id].history.deletedReviewers =
            pullRequests[id].history.deletedReviewers || [];
        pullRequests[id].history.deletedReviewers
            .push(userToRemove);

        console.log('REMOVED REVIEWER', pullRequests[id]);
      }
    }

    /**
     * UPDATE PULL REQUEST DATA - REVIEWER COMMENTED
     * (as part of the CR)
     */
    if (_.isEqual(githubEvent, 'pull_request_review_comment') &&
            _.isEqual(eventData.action, 'created')) {
      var id = utilities.getPullRequestIdFromEventData(eventData);
      utilities.mergeBasePRData(pullRequests, eventData);
      // need to parse this and add to pull request data
      var newReviewComment = utilities.parseReviewComment(eventData.comment);

      if (!pullRequests[id].reviewComments) {
        pullRequests[id].reviewComments = [];
      }

      pullRequests[id].reviewComments.push(newReviewComment);
      pullRequests[id].reviewComments =
        _.uniqBy(pullRequests[id].reviewComments, 'id');
      console.log('NEW REVIEW COMMENT', pullRequests[id]);
    }

    /**
     * UPDATE PULL REQUEST DATA - REVIEWER DELETED COMMENT
     * (as part of the CR)
     */
    if (_.isEqual(githubEvent, 'pull_request_review_comment') &&
            _.isEqual(eventData.action, 'deleted')) {
      var id = utilities.getPullRequestIdFromEventData(eventData);
      utilities.mergeBasePRData(pullRequests, eventData);

      pullRequests[id].history =
        pullRequests[id].history || {};

      if (pullRequests[id].reviewComments) {
        pullRequests[id].reviewComments = [];
      } else {
        var originalComment = _.find(pullRequests[id].reviewComments, {
          id: eventData.comment.id
        });

        if (originalComment) {
          pullRequests[id].reviewComments =
            _.without(pullRequests[id].reviewComments, originalComment);
          pullRequests[id].history.reviewComments =
              pullRequests[id].history.reviewComments || {};
          pullRequests[id].history.reviewComments.deleted =
              pullRequests[id].history.reviewComments.deleted || [];
          pullRequests[id].history.reviewComments.deleted
              .push(eventData.comment.id);
          console.log('DELETED REVIEW COMMENT', pullRequests[id]);
        }
      }
    }

    /**
     * UPDATE PULL REQUEST DATA - REVIEWER EDITED COMMENT
     * (as part of the CR)
     */
    if (_.isEqual(githubEvent, 'pull_request_review_comment') &&
            _.isEqual(eventData.action, 'edited')) {
      utilities.mergeBasePRData(pullRequests, eventData);
      var id = utilities.getPullRequestIdFromEventData(eventData);
      pullRequests[id].history =
        pullRequests[id].history || {};
      var updatedReviewComment =
        utilities.parseReviewComment(eventData.comment);
      var oldBodyValue = eventData.changes.body.from;

      var originalComment = _.find(pullRequests[id].reviewComments, {
        id: eventData.comment.id
      });

      if (!originalComment) {
        pullRequests[id].reviewComments =
          pullRequests[id].reviewComments || [];
        pullRequests[id].reviewComments.push(updatedReviewComment);
        originalComment = updatedReviewComment;
      }

      pullRequests[id].history.reviewComments =
          pullRequests[id].history.reviewComments || {};

      pullRequests[id].history.reviewComments[eventData.comment.id] =
          pullRequests[id].history.reviewComments[eventData.comment.id] || [];

      pullRequests[id].history.reviewComments[eventData.comment.id]
          .push(oldBodyValue);
      originalComment.message = updatedReviewComment.message;
      console.log('EDITED REVIEW COMMENT', pullRequests[id]);
    }

    /**
     * UPDATE PULL REQUEST DATA - REVIEW SUBMITTED
     */
    if (_.isEqual(githubEvent, 'pull_request_review') &&
            _.isEqual(eventData.action, 'submitted')) {

      var newReviewStatus = utilities.parseReviewStatus(eventData.review);
      var id = utilities.getPullRequestIdFromEventData(eventData);
      utilities.mergeBasePRData(pullRequests, eventData);

      if (!pullRequests[id].reviews) {
        pullRequests[id].reviews = [];
      }

      pullRequests[id].reviews.push(newReviewStatus);
      pullRequests[id].reviews =
        _.uniqBy(pullRequests[id].reviews, 'id');
      console.log('NEW REVIEW STATUS RECIEVED', pullRequests[id]);
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
      utilities.mergeBasePRData(pullRequests, eventData);

      achievibitDB.getExtraPRData(pullRequests[id], function() {
        dataReady(id, io);
      });
    }
  };

  function dataReady(id, io) {
    console.info(colors.rainbow('~~== PULL REQUEST MERGED! ==~~'),
      pullRequests[id]);

    achievibitDB.addPRItems(pullRequests[id], function() {
      console.info('everything finished');

      var allPRUsers = [ pullRequests[id].creator ];
      if (_.isArray(pullRequests[id].reviewers)) {
        allPRUsers = allPRUsers.concat(pullRequests[id].reviewers);
      }
      grantAchievements(allPRUsers, pullRequests[id], io);
    });
  }

  function grantAchievements(allPRUsers, pullRequest, io) {
    console.info(colors.rainbow('~~== CHECKING ACHIEVEMENTS ==~~'));
    if (!allPRUsers) {
      console.error('no users to grant achievements', allPRUsers);
      return;
    }

    var grantedAchievements = {};

    var checkAchievements = [];
    // check for achievements
    _.forEach(achievements, function(achievement, achievementFilename) {
      checkAchievements
        .push(checkAchievementTask(achievement,
          achievementFilename, allPRUsers, pullRequest, grantedAchievements));
    });

    async.parallel(checkAchievements, function() {
      _.forEach(allPRUsers, function(user) {
        if (grantedAchievements[user.username]) {
          achievibitDB.findItem('users', {
            username: user.username
          }).then(function(users) {
            var _user = users[0];

            if (!_user.achievements) {
              _user.achievements = [];
            }

            var userAchievements = _user.achievements;
            var newAchievements = _.differenceBy(
              grantedAchievements[_user.username],
              userAchievements,
              'name'
            );

            _.forEach(newAchievements, function(achievementObject) {
              io.sockets.emit(_user.username, achievementObject);
            });

            var newData = {};

            if (newAchievements) {
              newData.achievements = {
                $each: newAchievements
              };
            }

            console.log('adding achievements to DB for ' + _user.username);
            try {
              achievibitDB.updatePartialArray('users', {
                username: _user.username
              }, newData);
            } catch (error) {
              console.error(error);
            }
          });
        }
      });
    });
  }

  function checkAchievementTask(achievement,
    achievementFilename, allPRUsers, pullRequest, grantedAchievements) {

    return function(callback) {
      if (_.isFunction(achievement.check)) {
        try {
          if (_.isBoolean(achievement.accumulative) &&
          achievement.accumulative) {
            var searchUsernamesArray = _.map(allPRUsers, function(user) {
              return { username: user.username };
            });
          //console.log('searchUsernamesArray', searchUsernamesArray);
            achievibitDB.findItem('users', {
              $or: searchUsernamesArray
            }).then(function(users) {
              var userToCounter = {};
              _.forEach(users, function(user) {
                userToCounter[user.username] =
                _.get(user, 'accumulatives.' + achievement.name) || 0;
              });
              console.error('this is what we got', userToCounter);
              achievement.check(pullRequest,
               new Shall(achievement, achievementFilename, grantedAchievements),
               userToCounter);
              callback(null, 'finished');
            });
          } else {
            achievement.check(pullRequest,
              new Shall(achievement, achievementFilename, grantedAchievements));
            callback(null, 'finished');
          }
        } catch (error) {
          console.error([
            'ERROR IN ACHIEVEMENT ',
            achievement.name || achievementFilename
          ].join(''), error.message);
          callback(null, 'ERROR');
        }
      }
    };
  }

  function Shall(achievement, achievementFilename, grantedAchievements) {
    return {
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
          grantedAchievements[username].push(achievementObject);
          console.log([
            colors.bgWhite.green('ACHIEVEMENT UNLOCKED:'),
            colors.bgYellow.black.bold(username),
            'recieved',
            colors.bgYellow.black.bold(achievementObject.name)
          ].join(' '), achievementObject);
        } else {
          console.error([
            achievementObject.name || achievementFilename,
            ': didn\'t get the correct structure. see documentation'
          ].join(''), Achievement.errors(achievementObject));
        }
      },
      pass: function(username, treasure) {
        if (Treasure(treasure)) {
          // TODO(thatkookooguy): do we need this first call? what happens if
          // there's no user in line 555?
          achievibitDB.findItem('users', {
            username: username
          }).then(function() {

            var dataObject = {};

            dataObject['treasures.' + treasure.name] = treasure.gem;

            achievibitDB.updatePartially('users', {
              username: username
            }, dataObject);

          }, function(error) {
            console.error('GOD DAMMIT!', error);
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
        return achievibitDB.findItem('users', {
          username: username
        }).then(function(users) {
          var user = users[0];
          var foundTreasure =
            user && user.treasures && user.treasures[treasureName];
          return foundTreasure ? user.treasures[treasureName] : null;
        });
      },
      progress: function(username, newCounter) {
        if (!achievement.accumulative) {
          console.error([
            'progress should only be used by accumulative achievements'
          ].join(''));
          return;
        }
        if (!_.isString(username) ||
          _.isObject(newCounter) ||
          _.isArray(newCounter)) {

          console.error([
            'retrieve expects a username and a new PRIMITIVE counter'
          ].join(''));
          return;
        }

        var newData = {};

        newData.accumulatives = {};

        newData.accumulatives[achievement.name] = newCounter;

        var dataObject = {};

        dataObject['accumulatives.' + achievement.name] = newCounter;
        console.log('gonna update with this data:', dataObject);

        return achievibitDB.updatePartially('users', {
          username: username
        }, dataObject);
      }
    };
  }
};

var eventManager = new EventManager();

module.exports = eventManager;
