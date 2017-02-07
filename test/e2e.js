var expect    = require('chai').expect;
var nconf = require('nconf');
var http = require('http');
var config = require('../config');

nconf.overrides({
  databaseUrl: 'test',
  testDB: true,
  stealth: 'stealth'
});

var achievibit = require('../index');

describe('achievibit - End-to-End', function() {
  it('should return 200 for homepage', function (done) {
    http.get('http://localhost:' + config.port, function (res) {
      expect(res.statusCode).to.equal(200);
      done();
    });
  });

  describe('/raw/:username raw user data', function() {
    it('should return raw user data if exists', function (done) {
      http.get([
        'http://localhost:',
        config.port,
        '/raw/dbUser'
      ].join(''), function (res) {
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

    it('should return error on non-existing user', function (done) {
      http.get([
        'http://localhost:',
        config.port,
        '/raw/dbUser'
      ].join(''), function (res) {
        expect(res.statusCode).to.equal(204);
        done();
      });
    });
  });

  describe('/:username user page', function() {
    it('should return user html page if exists in DB', function (done) {
      http.get([
        'http://localhost:',
        config.port,
        '/dbUser'
      ].join(''), function (res) {
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

    it('should redirect to hompage on non-existing user', function (done) {
      http.get([
        'http://localhost:',
        config.port,
        '/dbUser'
      ].join(''), function (res) {
        expect(res.statusCode).to.equal(301);
        done();
      });
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
