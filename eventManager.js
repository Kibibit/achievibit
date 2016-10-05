var util = require('util');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var github = require('octonode');
var client = github.client();
var request = require('request');
var url = process.env.MONGOLAB_URI || 'mongodb://thatkookooguy:56784321@ds015325.mlab.com:15325/achievibit';
var mongo = require('mongodb');
var monk = require('monk');
var schema = require('js-schema');
var db = monk(url);
var achievements = require('require-all')({
  dirname     :  __dirname + '/achievements',
  filter      :  /(.+achievement)\.js$/,
  excludeDirs :  /^\.(git|svn)$/,
  recursive   : true
});
var alreadyReturned = {
    comments: false,
    commits: false,
    reactions: [],
    inlineComments: false,
    files: false
};

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

// @station - an object with `freq` and `name` properties
var EventManager = function() {

    // we need to store the reference of `this` to `self`, so that we can use the current context in the setTimeout (or any callback) functions
    // using `this` in the setTimeout functions will refer to those funtions, not the Radio class
    var self = this;
    
    self.notifyAchievements = function(githubEvent, eventData) {
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
            var id = eventData.repository.full_name + '/' + eventData.number;

            //var pullRequests = db.get('pullRequests');
            if (!pullRequests[id]) {
                pullRequests[id] = {};
            }
            _.merge(pullRequests[id], {
                id: id,
                url: eventData.pull_request.html_url,
                number: eventData.number,
                title: eventData.pull_request.title,
                description: eventData.pull_request.body,
                creator: createUserData(eventData.pull_request.user),
                createdOn: eventData.pull_request.created_at,
                //milestone: eventData.pull_request.milestone,
                labels: [],
                history: {},
                repository: {
                    name: eventData.repository.name,
                    fullname: eventData.repository.full_name,
                    url: eventData.repository.html_url
                }
            });

            if (_.isEqual(eventData.repository.owner.type, 'Organization')) {
                pullRequests[id].organization = {
                    username: eventData.repository.owner.login,
                    url: eventData.repository.owner.html_url,
                    avatar: eventData.repository.owner.avatar_url,
                    organization: true
                };
            }

            if (eventData.pull_request.assignees) {
                var assignees = eventData.pull_request.assignees;
                pullRequests[id].reviewers = [];
                for (var i = 0; i < assignees.length; i++) {
                    pullRequests[id].reviewers.push(createUserData(assignees[i]));
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
            var id = eventData.repository.full_name + '/' + eventData.number;
            pullRequests[id]
                .labels.push(eventData.label.name);

            console.log('added labels on creation', JSON.stringify(pullRequests[id], null, 2));

        /**
         * UPDATE PULL REQUEST DATA - LABEL ADDED
         */
        } else if (_.isEqual(githubEvent, 'pull_request') &&
            _.isEqual(eventData.action, 'labeled')) {
            /////
            var id = eventData.repository.full_name + '/' + eventData.number;
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
            var id = eventData.repository.full_name + '/' + eventData.number;
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
            var id = eventData.repository.full_name + '/' + eventData.number;

            // if by any chance we missed creating the pull request,
            // create it here (means we won't have history)
            if (!pullRequests[id]) {
                pullRequests[id] = {};
            }

            // update to latest info for some things
            _.assign(pullRequests[id], {
                _id: id,
                url: eventData.pull_request.html_url,
                number: eventData.number,
                title: eventData.pull_request.title,
                description: eventData.pull_request.body,
                creator: createUserData(eventData.pull_request.user),
                createdOn: eventData.pull_request.created_at,
                repository: {
                    name: eventData.repository.name,
                    fullname: eventData.repository.full_name,
                    url: eventData.repository.html_url
                }
            });
            var ghpr = client.pr(eventData.repository.full_name, eventData.number);
            var ghissue = client.issue(eventData.repository.full_name, eventData.number);
            alreadyReturned = {
                comments: false,
                commits: false,
                reactions: [],
                inlineComments: false,
                files: false
            };
            ghissue.comments(function(err, comments) {
                if (err) throw err;

                alreadyReturned.reactions =
                    _.times(comments.length, _.constant(false));
                pullRequests[id].comments = [];
                _.forEach(comments, function(comment) {
                    var commentParsed = {
                    author: createUserData(comment.user),
                    message: comment.body,
                    createdOn: comment.created_at,
                    edited: !_.isEqual(comment.created_at, comment.updated_at),
                    apiUrl: comment.url
                  };
                  pullRequests[id].comments.push(commentParsed);

                  getReactions(commentParsed, id);
                });

                alreadyReturned.comments = true;
                dataReady(id);
            });
            ghpr.commits(function(err, commits) {
                if (err) throw err;

                pullRequests[id].commits = [];
                _.forEach(commits, function(commit) {
                   pullRequests[id].commits.push({
                    sha: commit.sha,
                    author: createUserData(commit.author),
                    committer: createUserData(commit.committer),
                    message: commit.commit.message,
                    commentCount: commit.comments

                   }); 
                });

                alreadyReturned.commits = true;
                dataReady(id);
            });
            ghpr.comments(function(err, inlineComments) {
                if (err) throw err;

                alreadyReturned.reactions =
                    alreadyReturned.reactions.concat(_.times(inlineComments.length, _.constant(false)));
                pullRequests[id].inlineComments = [];
                _.forEach(inlineComments, function(inlineComment) {
                    var inlineCommentParsed = {
                    file: inlineComment.path,
                    author: createUserData(inlineComment.user),
                    message: inlineComment.body,
                    createdOn: inlineComment.created_at,
                    edited: !_.isEqual(inlineComment.created_at, inlineComment.updated_at),
                    commit: inlineComment.commit_id,
                    apiUrl: inlineComment.url

                   };
                   pullRequests[id].inlineComments.push(inlineCommentParsed);

                   getReactions(inlineCommentParsed, id);
                });

                alreadyReturned.inlineComments = true;
                dataReady(id);
            });

            ghpr.files(function(err, files) {
                if (err) throw err;

                pullRequests[id].files = [];
                _.forEach(files, function(file) {
                    pullRequests[id].files.push({
                        content: getNewFileFromPatch(file.patch),
                        name: file.filename
                    });
                });

                alreadyReturned.files = true;
                dataReady(id);
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
            var id = eventData.repository.full_name + '/' + eventData.number;
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
            var id = eventData.repository.full_name + '/' + eventData.number;
            if (!pullRequests[id]) {
                pullRequests[id] = {};
            }
            var assignees = eventData.pull_request.assignees;
            pullRequests[id].reviewers = [];
            for (var i = 0; i < assignees.length; i++) {
                pullRequests[id].reviewers.push(createUserData(assignees[i]));
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

    function getReactions(comment, id) {
        request({
            url: comment.apiUrl + '/reactions',
            headers: {
                'Accept': 'application/vnd.github.squirrel-girl-preview',
                'User-Agent': 'achievibit'
            }
        }, function(err, response, body) {
            if (err) throw err;

            var index = alreadyReturned.reactions.indexOf(false);
            alreadyReturned.reactions[index] = true;
            if (response.statusCode == 200) {

                var reactions = JSON.parse(body);
                comment.reactions = [];
                _.forEach(reactions, function(reaction) {
                    comment.reactions.push({
                        reaction: reaction.content,
                        user: createUserData(reaction.user)
                    });
                });
            } else {
                console.error('wrong status from server: [' +
                    response.statusCode +
                    '] ' +
                    body);
            }
            dataReady(id);
        });
    }

    function dataReady(id) {
        if (alreadyReturned &&
            alreadyReturned.comments &&
            alreadyReturned.commits &&
            _.every(alreadyReturned.reactions) &&
            alreadyReturned.inlineComments &&
            alreadyReturned.files) {

            console.log('~~== PULL REQUEST MERGED! ==~~');

            // add creator to database
            console.log('adding users to database');
            var users = db.get('users');
            users.index( { username: 1 }, { unique: true, sparse: true } );
            users.insert(pullRequests[id].creator);

            // add organization to database
            console.log('adding organization to database');
            if (pullRequests[id].organization) {
                users.insert(pullRequests[id].organization);
                //addOrganization(pullRequests[id].creator.username, pullRequests[id].organization);
            }

            // add reviewers to database
            _.forEach(pullRequests[id].reviewers, function(reviewer) {
                users.insert(reviewer);
                //addOrganization(reviewer.username, pullRequests[id].organization);
            });

            console.log('~~== CHECKING ACHIEVEMENTS ==~~');

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
                            grantedAchievements[username].push(achievementObject);
                        } else {
                            console.error(achievementObject.name || achievementFilename +
                                ': didn\'t get the correct structure. see documentation');
                        }
                    },
                    pass: function(username, treasure) {
                        if (Treasure(treasure)) {
                            var treasures = {};
                            treasures[treasure.name] = treasure;
                            users.find({ username: username }).then(function(user) {
                                console.log(user);
                            });
                            users.update({ username: username }, {
                                treasures: treasures
                            });
                        }
                    },
                    retrieve: function(username) {
                        if (!_.isString(username) || !_.isString(achievementName)) {
                            console.error('retrieve expects a username and achievement name');
                            return;
                        }
                        return users.find({ username: username });
                    }
                };
                achievement.check && achievement.check(pullRequests[id], shall);

                _.forEach(grantedAchievements, function(achievements, username) {
                    users.findOne({ username: username }).then(function(user) {
                        if (!user.achievements) {
                            user.achievements = [];
                        }
                        var userAchievements = user.achievements;
                        userAchievements = _.uniqBy(userAchievements.concat(achievements), 'name');
                        user.achievements = userAchievements
                        users.update(user._id, user);
                    });
                });
            });
        }
    }

    function createUserData(githubUser) {
        return {
            username: githubUser.login,
            url: githubUser.html_url,
            avatar: githubUser.avatar_url
        };
    }

    function addOrganization(username, organizationUsername) {
        var users = db.get('users');

        users.findOne({ username: username }).then(function(user) {
            users.findOne({ username: organizationUsername, organization: true }).then(function(organization) {
                if (!user.organizations) {
                    user.organizations = [];
                }
                var organizations = user.organizations;
                organizations = _.uniqBy(organizations.concat([{
                    username: organization.username,
                    avatar: organization.avatar,
                    url: organization.url
                }]), 'username');
                user.organizations = organizations
                users.update(user._id, user);

                if (organization.users) {
                    organization.users = [];
                }
                var users = organization.users;
                users = _.uniqBy(users.concat([{
                    username: user.username,
                    avatar: user.avatar,
                    url: user.url
                }]), 'username');
                organization.users = users
                users.update(organization._id, organization);
            });
        });
    }
    
};

// extend the EventEmitter class using our Radio class
util.inherits(EventManager, EventEmitter);

var eventManager = new EventManager();

module.exports = eventManager;