var VARS = require('./testUtilities/variables');
var expect    = require('chai').expect;
var proxyquire =  require('proxyquire');
var firebaseAdminMock = require('./stubs/firebaseAdmin.mock');
var configurationServiceMock = require('./stubs/configurationService.mock');
var achievibitDBMock = require('./stubs/achievibitDB.mock');

// should make the userService return data instead to make tests easier

describe('achievibit user service', function() {

  // after(function() {
  //   fs.renameSync(tmpFilePath, filePath);
  // });

  describe('authenticateUsingToken', function() {
    describe('not connected to firebase authentication service', function() {
      it('should return error for valid token', function() {

        var userService = proxyquire('../app/models/userService', {
          'firebase-admin': firebaseAdminMock,
          '../app/models/configurationService': configurationServiceMock.empty
        });

        return userService
          .authenticateUsingToken(VARS.TOKEN_TYPE.VALID)
          .then(function() {
            expect().fail('exception did not appear to be thrown');
          }, function(error) {
            expect(error).to.equal('server is not authenticated with firebase');
          });
      });

      it('should return error for an invalid token', function() {

        var userService = proxyquire('../app/models/userService', {
          'firebase-admin': firebaseAdminMock,
          '../app/models/configurationService': configurationServiceMock.empty
        });

        return userService
          .authenticateUsingToken(VARS.TOKEN_TYPE.INVALID)
          .then(function() {
            expect().fail('exception did not appear to be thrown');
          }, function(error) {
            expect(error).to.equal('server is not authenticated with firebase');
          });
      });
    });
    describe('conntected to firebase authentication service', function() {
      describe('authenticateUsingToken', function() {
        it('should return a user for valid token', function() {

          var userService = proxyquire('../app/models/userService', {
            'firebase-admin': firebaseAdminMock,
            './configurationService': configurationServiceMock.full
          });

          return userService
            .authenticateUsingToken(VARS.TOKEN_TYPE.VALID)
            .then(function(user) {
              expect(user).to.equal(VARS.FIREBASE_USER);
            });

        });

        it('should return error for invalid token', function() {

          var userService = proxyquire('../app/models/userService', {
            'firebase-admin': firebaseAdminMock,
            './configurationService': configurationServiceMock.full
          });

          return userService
            .authenticateUsingToken(VARS.TOKEN_TYPE.INVALID)
            .then(function() {
              expect().fail('exception did not appear to be thrown');
            }, function(error) {
              expect(error).to.exist;
            });

        });

      });
    });
  });

  describe('getAuthUserData', function() {
    it('should return error if no authentication token given', function() {

      var userService = proxyquire('../app/models/userService', {
        'firebase-admin': firebaseAdminMock,
        './configurationService': configurationServiceMock.full
      });

      return userService.getAuthUserData().then(function() {
        expect().fail('exception did not appear to be thrown');
      }, function(error) {
        expect(error.code).to.equal(401);
      });
    });

    it('should return error if authentication not valid', function() {

      var userService = proxyquire('../app/models/userService', {
        'firebase-admin': firebaseAdminMock,
        './configurationService': configurationServiceMock.full
      });

      return userService.getAuthUserData(VARS.TOKEN_TYPE.INVALID)
        .then(function() {
          expect().fail('exception did not appear to be thrown');
        }, function(error) {
          expect(error.code).to.equal(500);
        });
    });

    it('should return error if new user and error aggregated', function() {

      var userService = proxyquire('../app/models/userService', {
        'firebase-admin': firebaseAdminMock,
        './configurationService': configurationServiceMock.full,
        '../../achievibitDB': achievibitDBMock.aggregation
      });

      return userService.getAuthUserData(VARS.TOKEN_TYPE.VALID)
        .then(function() {
          expect().fail('exception did not appear to be thrown');
        }, function(error) {
          expect(error.code).to.equal(500);
        });
    });

    it('should return user if authentication is valid',
      function() {

        var userService = proxyquire('../app/models/userService', {
          'firebase-admin': firebaseAdminMock,
          './configurationService': configurationServiceMock.full,
          '../../achievibitDB': achievibitDBMock
        });

        return userService.getAuthUserData(VARS.TOKEN_TYPE.VALID)
          .then(function(data) {
            expect(data.code).to.equal(200);
            expect(data.newUser).to.equal(VARS.ACHIEVIBIT_USER);
          });
      });

    it('should return user with new github token on new sign in',
      function() {

        var userService = proxyquire('../app/models/userService', {
          'firebase-admin': firebaseAdminMock,
          './configurationService': configurationServiceMock.full,
          '../../achievibitDB': achievibitDBMock
        });

        return userService
          .getAuthUserData(VARS.TOKEN_TYPE.VALID, VARS.NEW_GITHUB_TOKEN)
          .then(function(data) {
            expect(data.code).to.equal(200);
            expect(data.newUser.githubToken)
              .to.equal(VARS.NEW_GITHUB_TOKEN);
          });
      });

    it('should return error with new github token and error aggregated',
      function() {

        var userService = proxyquire('../app/models/userService', {
          'firebase-admin': firebaseAdminMock,
          './configurationService': configurationServiceMock.full,
          '../../achievibitDB': achievibitDBMock.aggregation
        });

        return userService
          .getAuthUserData(VARS.TOKEN_TYPE.VALID, VARS.NEW_GITHUB_TOKEN)
          .then(function() {
            expect().fail('exception did not appear to be thrown');
          }, function(error) {
            expect(error.code).to.equal(500);
          });
      });
  });
});
