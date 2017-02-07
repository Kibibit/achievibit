var expect    = require('chai').expect;
var nconf = require('nconf');
var http = require('http');
var config = require('../config');

nconf.overrides({
  databaseUrl: 'test',
  testDB: true
});

var achievibit = require('../index');

describe('achievibit - End-to-End', function() {
  it('should return 200', function (done) {
    http.get('http://localhost:' + config.port, function (res) {
      expect(res.statusCode).to.equal(200);
      done();
    });
  });

  it('should return shield', function (done) {
    http.get([
      'http://localhost:', config.port, '/achievementsShield'
    ].join(''), function (res) {
      expect(res.statusCode).to.equal(200);
      expect(res.headers['content-type'])
        .to.equal('image/svg+xml; charset=utf-8');
      done();
    });
  });
});
