var expect    = require('chai').expect;
var nconf = require('nconf');

nconf.overrides({
  databaseUrl: 'test',
  testDB: true
});

var achievibitDB = require('../achievibitDB');

describe('achievibit DB', function() {
  it('should set indexes for the database', function() {

  });
});
