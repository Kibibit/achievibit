var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var colors = require('colors');
var github = require('octonode');
var schema = require('js-schema');
var async = require("async");
var achievibitDB = require('./achievibitDB');
var utilities = require('./utilities');
var console = require('./consoleService')('GITHUB-EVENTS', ['blue', 'inverse'], process.console);
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

// all currently open pull requests
var pullRequests = {};

var EventManager = function() {
    var self = this;

    self.notifyAchievements = function(githubEvent, eventData, io) {
        /**
         * NEW REPO CONNECTED!!!
         * a repo added achievibit as a GitHub webhook!
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
         * Get the data as it was when the pull request opened.
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

            console.log('created new ' + colors.bgBlue.white.bold('pull request') + ' object', pullRequests[id]);
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

            console.log('UPDATE assignees', pullRequests[id]);
        }

        if (_.isEqual(githubEvent, 'pull_request_review_comment') &&
            _.isEqual(eventData.action, 'created')) {
            //self.emit('open', eventData);
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

            achievibitDB.getExtraPRData(pullRequests[id], function() {
              dataReady(id, io);
            });
        }
    }

    function dataReady(id, io) {
            console.info(colors.rainbow('~~== PULL REQUEST MERGED! ==~~'), pullRequests[id]);

            achievibitDB.addPRItems(pullRequests[id], function(err, results) {
              console.info('everything finished');

              var allPRUsers = [pullRequests[id].creator];
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
                      console.log([
                        colors.bgWhite.green('ACHIEVEMENT UNLOCKED:'),
                        colors.bgYellow.black.bold(username),
                        'recieved',
                        colors.bgYellow.black.bold(achievementObject.name)
                      ].join(' '), achievementObject);
                  } else {
                      console.error(achievementObject.name || achievementFilename +
                          ': didn\'t get the correct structure. see documentation', Achievement.errors(achievementObject));
                  }
              },
              pass: function(username, treasure) {
                  if (Treasure(treasure)) {
                      // TODO(thatkookooguy): do we need this first call? what happens if there's no user in line 555?
                      achievibitDB.findItem('users', { username: username }).then(function(users) {

                          var dataObject = {};

                          dataObject['treasures.' + treasure.name] = treasure.gem;

                          achievibitDB.updatePartially('users', { username: username }, dataObject);
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
                  return achievibitDB.findItem('users', { username: username }).then(function(users) {
                    var user = users[0];
                    var foundTreasure = user && user.treasures && user.treasures[treasureName];
                    return foundTreasure ? user.treasures[treasureName] : null;
                  });
              }
          };

          // check for achievements
          _.forEach(achievements, function(achievement, achievementFilename) {
              if (_.isFunction(achievement.check)) {
                try {
                  achievement.check(pullRequest, shall);
                } catch (error) {
                  console.error('ERROR IN ACHIEVEMENT ' + achievement.name, error.message);
                }
              }
          });

          _.forEach(allPRUsers, function(user) {
              if (grantedAchievements[user.username]) {
                achievibitDB.findItem('users', { username: user.username }).then(function(users) {
                  var _user = users[0];

                  if (!_user.achievements) {
                      _user.achievements = [];
                  }

                  var userAchievements = _user.achievements;
                  var newAchievements = _.differenceBy(grantedAchievements[_user.username], userAchievements, 'name');

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
    }
};

var eventManager = new EventManager();

module.exports = eventManager;
