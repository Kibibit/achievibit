var console = require('../models/consoleService')();
var _ = require('lodash');
var moment = require('moment');
var configService = require('./configurationService')();
var CONFIG = configService.get();
var achievibitDB = require('../../achievibitDB');
var url = CONFIG.databaseUrl;
var dbLibrary = CONFIG.testDB ? 'monkey-js' : 'monk';
var monk = require(dbLibrary);
var db = monk(url);
var async = require('async');

var admin = require('firebase-admin');

var serviceAccount = {
  'type': CONFIG.firebaseType,
  'project_id': CONFIG.firebaseProjectId,
  'private_key_id': CONFIG.firebasePrivateKeyId,
  'private_key': CONFIG.firebasePrivateKey,
  'client_email': CONFIG.firebaseClientEmail,
  'client_id': CONFIG.firebaseClientId,
  'auth_uri': CONFIG.firebaseAuthUri,
  'token_uri': CONFIG.firebaseTokenUri,
  'auth_provider_x509_cert_url': CONFIG.firebaseAPx509CU,
  'client_x509_cert_url': CONFIG.firebaseCx509CU
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: CONFIG.firebaseDBURL
});

var defaultAuth = admin.auth();

var userService = {};

userService.authenticateUsingToken = function(token) {
  return defaultAuth.verifyIdToken(token);
};

userService.getAuthUserData = function(req, res) {
  var userParams = req.query;

  if (!userParams.firebaseToken) {
    console.error('missing authorization header');
    res.status(401).send('missing authorization header');
    return;
  }

  userService.authenticateUsingToken(userParams.firebaseToken)
    .then(function(decodedToken) {
      var uid = decodedToken.uid;
      console.log('user verified! this is the uid', uid);

      // new sign in (clicked on sign-in)
      if (userParams.githubToken) {
        achievibitDB.getAndUpdateUserData(uid, {
          uid: uid,
          githubToken: userParams.githubToken,
          username: userParams.githubUsername,
          timezone: userParams.timezone
        }).then(function(newUser) {
          res.json({
            achievibitUserData: _.omit(newUser, ['_id', 'githubToken', 'uid'])
          });
        }, function(error) {
          console.error(error);
          res.status(500).send('couldn\'t create\\update user');
        });
      } else { // existing token on client side
        achievibitDB.getAndUpdateUserData(uid).then(function(newUser) {
          res.json({
            achievibitUserData: _.omit(newUser, ['_id', 'githubToken', 'uid'])
          });
        }, function(error) {
          console.error(error);
          res.status(500).send('couldn\'t create\\update user');
        });
      }
      // ...
    }).catch(function(error) {
      // Handle error
      console.error(error);
      res.json({ achievibitUserData: {} });
    });
};

userService.getMinimalUser = function(req, res) {
  var users = db.get('users');
  var username = decodeURIComponent(req.params.username);
  users.findOne({ username: username }).then(function(user) {
    if (!user) {
      res.status(204).send('no user found');
      return;
    }

    res.json(user);
  }, function() {
    res.status(500).send('something went wrong');
  });
};

userService.getFullUser = function(req, res) {
  var users = db.get('users');
  var repos = db.get('repos');
  var username = decodeURIComponent(req.params.username);
  async.waterfall([
    function(callback) {
      users.findOne({ username: username }).then(function(user) {
        if (!user) {
          callback(username + ' user not found');
          return;
        }
        var byDate =
          _.reverse(_.sortBy(user.achievements, [ 'grantedOn' ]));
        _.forEach(byDate, function(achievement) {
          achievement.grantedOn = moment(achievement.grantedOn).fromNow();
        });
        callback(null, {
          user: user,
          achievements: byDate
        });
      }, function(error) {
        console.error('problem getting specific user', error);
        callback('request failed for some reason');
      });
    },
    function(pageObject, callback) {
      if (_.result(pageObject.user, 'organizations.length') > 0) {

        var organizationsUsernameArray = [];
        _.forEach(pageObject.user.organizations,
          function(organizationUsername) {
            organizationsUsernameArray.push({
              username: organizationUsername
            });
          }
        );

        if (organizationsUsernameArray.length > 0) {
          users.find({
            $or: organizationsUsernameArray
          }).then(function(userOrganizations) {
            pageObject.user.organizations = userOrganizations;

            callback(null, pageObject);
          }, function(error) {
            console.error('problem getting organizations for user', error);
            pageObject.user.organizations = [];
            callback(null, pageObject);
          });
        } else {
          callback(null, pageObject);
        }
      } else {
        callback(null, pageObject);
      }
    },
    function(pageObject, callback) {
      if (_.result(pageObject.user, 'users.length') > 0) {

        var usersUsernameArray = [];
        _.forEach(pageObject.user.users, function(userUsername) {
          usersUsernameArray.push({ username: userUsername });
        });

        if (usersUsernameArray.length > 0) {
          users.find({
            $or: usersUsernameArray
          }).then(function(organizationUsers) {
            pageObject.user.users = organizationUsers;

            callback(null, pageObject);
          }, function(error) {
            console.error('problem getting users for organization', error);
            pageObject.user.organizations = [];
            callback(null, pageObject);
          });
        } else {
          callback(null, pageObject);
        }
      } else {
        callback(null, pageObject);
      }
    },
    function(pageObject, callback) {
      if (!pageObject) {
        callback('failed to get user');
        return;
      }

      var repoFullnameArray = [];
      _.forEach(pageObject.user.repos, function(repoFullname) {
        repoFullnameArray.push({ fullname: repoFullname });
      });

      if (repoFullnameArray.length > 0) {
        repos.find({$or: repoFullnameArray}).then(function(userRepos) {
          pageObject.user.repos = userRepos;

          callback(null, pageObject);
        }, function(error) {
          console.error('problem getting repos for user', error);
          pageObject.user.repos = [];
          callback(null, pageObject);
        });
      } else {
        callback(null, pageObject);
      }

    }
  ], function (err, pageData) {
    if (err) {
      res.redirect(301, '/');
      return;
    }

    res.render('blog' , pageData);
  });
};

module.exports = userService;
