var _ = require('lodash');
var Q = require('q');
var VARS = require('../testUtilities/variables');

var firebaseAdminMock = {
  initializeApp: _.noop,
  credential: {
    cert: _.noop
  },
  auth: function() {
    return {
      verifyIdToken: function(token) {
        var deferred = Q.defer();

        if (token === VARS.TOKEN_TYPE.VALID) {
          deferred.resolve(VARS.FIREBASE_USER);
        } else {
          deferred.reject('user do not exist');
        }

        return deferred.promise;
      }
    };
  }
};

module.exports = firebaseAdminMock;
