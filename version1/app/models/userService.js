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
var Q = require('q');

var admin = require('firebase-admin');

var serviceAccount = {
  'type': CONFIG.firebaseType,
  'project_id': CONFIG.firebaseProjectId,
  'private_key_id': CONFIG.firebasePrivateKeyId,
  'private_key': _.replace(CONFIG.firebasePrivateKey, /\\n/g, '\n'),
  'client_email': CONFIG.firebaseClientEmail,
  'client_id': CONFIG.firebaseClientId,
  'auth_uri': CONFIG.firebaseAuthUri,
  'token_uri': CONFIG.firebaseTokenUri,
  'auth_provider_x509_cert_url': CONFIG.firebaseAPx509CU,
  'client_x509_cert_url': CONFIG.firebaseCx509CU
};

var areAllVariablesDefined =
  _.every(_.values(serviceAccount), function(value) {
    return !_.isNil(value);
  });

var defaultAuth = {
  verifyIdToken: function() {
    var deferred = Q.defer();
    deferred.reject('server is not authenticated with firebase');
    return deferred.promise;
  }
};

if (areAllVariablesDefined) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: CONFIG.firebaseDBURL
  });

  defaultAuth = admin.auth();
}

var userService = {};

userService.getOrganizationTopAchievements = achievibitDB.getOrganizationTopAchievements;

userService.authenticateUsingToken = function(token) {
  return defaultAuth.verifyIdToken(token);
};

userService.getAuthUserData =
  function(firebaseToken, githubToken, githubUsername, timezone) {
    var deferred = Q.defer();

    if (!firebaseToken) {
      console.error('missing authorization header');
      deferred.reject({
        code: 401,
        msg: 'missing authorization header'
      });

      return deferred.promise;
    }

    userService.authenticateUsingToken(firebaseToken)
      .then(function(decodedToken) {
        var uid = decodedToken.uid;
        console.log('user verified! this is the uid', uid);

        // new sign in (clicked on sign-in)
        if (githubToken) {
          achievibitDB.getAndUpdateUserData(uid, {
            uid: uid,
            githubToken: githubToken,
            username: githubUsername,
            timezone: timezone
          }).then(function(newUser) {
            deferred.resolve({
              code: 200,
              newUser: newUser
            });
          }, function(error) {
            console.error(error);
            deferred.reject({
              code: 500,
              msg: 'couldn\'t create\\update user',
              err: error
            });
          });
        } else { // existing token on client side
          achievibitDB.getAndUpdateUserData(uid).then(function(newUser) {
            deferred.resolve({
              code: 200,
              newUser: newUser
            });
          }, function(error) {
            console.error(error);
            deferred.reject({
              code: 500,
              msg: 'couldn\'t create\\update user',
              err: error
            });
          });
        }
        // ...
      }).catch(function(error) {
        // Handle error
        console.error(error);
        deferred.reject({
          code: 500,
          msg: 'something went wrong. check err for further details',
          err: error
        });
      });

    return deferred.promise;
  };

userService.getMinimalUser = function(username) {
  var deferred = Q.defer();

  var users = db.get('users');
  users.findOne({ username: username }).then(function(user) {
    if (!user) {
      deferred.reject({
        code: 204,
        msg: 'no user found',
        err: error
      });
      return;
    }

    deferred.resolve(user);

  }, function(error) {
    deferred.reject({
      code: 500,
      msg: 'something went wrong',
      err: error
    });
  });

  return deferred.promise;
};

userService.getFullUser = function(username) {
  var deferred = Q.defer();

  var users = db.get('users');
  var repos = db.get('repos');

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
      deferred.reject({
        code: 301,
        redirect: '/',
        err: err
      });
      return;
    }

    deferred.resolve({
      code: 200,
      pageData: pageData
    });
  });


  return deferred.promise;
};

module.exports = userService;
