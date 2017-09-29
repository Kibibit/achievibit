var _ = require('lodash');
var Q = require('q');
var VARS = require('../testUtilities/variables');

var achievibitDBMock = {
  getAndUpdateUserData: function(uid, updateWith) {
    var deferred = Q.defer();

    if (!updateWith) {
      // return achievibitUser
      deferred.resolve(VARS.ACHIEVIBIT_USER);
    } else {
      var newUser = _.clone(VARS.ACHIEVIBIT_USER);
      newUser.githubToken = updateWith.githubToken;
      deferred.resolve(newUser);
    }

    return deferred.promise;
  },
  aggregation: {
    getAndUpdateUserData: function() {
      var deferred = Q.defer();

      deferred.reject('AGGREGATED');

      return deferred.promise;
    }
  }
};

module.exports = achievibitDBMock;
