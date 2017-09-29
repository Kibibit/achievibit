var _ = require('lodash');
var console = require('./consoleService')();
var nconf = require('nconf');
var auth = require('http-auth'); // @see https://github.com/gevorg/http-auth

var allAchievibitConfigNames = [
  'firebaseType',
  'firebaseProjectId',
  'firebasePrivateKeyId',
  'firebasePrivateKey',
  'firebaseClientEmail',
  'firebaseClientId',
  'firebaseAuthUri',
  'firebaseTokenUri',
  'firebaseAPx509CU',
  'firebaseCx509CU',
  'port',
  'databaseUrl',
  'stealth',
  'testDB',
  'logsUsername',
  'logsPassword',
  'ngrokToken'
];

// look for config in:
nconf
  .argv()
  .env({whitelist: allAchievibitConfigNames})
  .file({ file: 'privateConfig.json' });

var configService = function() {

  var shouldSaveToFile = nconf.get('savePrivate');

  if (shouldSaveToFile) {
    _.forEach(allAchievibitConfigNames, function(varName) {
      nconf.set(varName, nconf.get(varName));
      var tmp = {};
      tmp[varName] =  nconf.get(varName);
      console.log('got this config', tmp);
    });

    nconf.save(function (err) {
      if (err) {
        console.error('problem saving private configuration');
      } else {
        console.info('PERSONAL CONFIG SAVED! DELETE WHEN FINISHED!');
      }
    });
  }

  return {
    get: function(name) {
      return nconf.get(name);
    },
    haveLogsAuth: !_.isNil(nconf.get('logsUsername')),
    createLogsAuthForExpress: function() {
      var basicAuth = auth.basic({
        realm: 'achievibit ScribeJS WebPanel'
      }, function (username, password, callback) {
        var logsUsername = nconf.get('logsUsername') ?
          nconf.get('logsUsername') + '' : '';

        var logsPassword = nconf.get('logsPassword') ?
          nconf.get('logsPassword') + '' : '';

        callback(username === logsUsername && password === logsPassword);
      });

      return auth.connect(basicAuth);
    }
  };
};

module.exports = configService;
