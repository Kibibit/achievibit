var expect    = require('chai').expect;
var Q = require('q');
var userService = require('../app/models/userService');

var TOKEN_TYPE = {
  VALID: 'EXISTING_USER',
  INVALID: 'NOT_A_USER'
};

var USER = {
  uid: 'UID'
};

// mock authenticateUsingToken
userService.authenticateUsingToken = function(token) {
  var deferred = Q.defer();

  if (token === TOKEN_TYPE.VALID) {
    deferred.resolve(USER);
  } else {
    deferred.reject('user do not exist');
  }

  return deferred.promise;
};

// should make the userService return data instead to make tests easier

describe('achievibit user service', function() {
  describe('authenticateUsingToken', function() {
    it('should return a user for valid token', function() {

      return userService.authenticateUsingToken(TOKEN_TYPE.VALID)
        .then(function(user) {
          expect(user).to.equal(USER);
        });

    });
  });
});
