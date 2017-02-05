var expect    = require('chai').expect;
var nconf = require('nconf');

nconf.overrides({
  databaseUrl: 'test',
  testDB: true
});

var eventManager = require('../eventManager');

describe('achievibit GitHub Event Manager', function() {
  it('it adds repo to DB on ping event', function() {

  });
});
