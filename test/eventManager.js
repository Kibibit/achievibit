var expect    = require('chai').expect;
var nconf = require('nconf');

nconf.overrides({
  databaseUrl: 'test',
  testDB: true
});

var eventManager = require('../eventManager');

describe('achievibit GitHub Event Manager', function() {
  it('should add repo to DB on ping event', function() {

  });
});
