var stubHelper = require('./stubs/stubHelper');
var expect    = require('chai').expect;

describe('printLogo', function() {

  it('should print logo if called to console log', function() {
    stubHelper(function() {
      var didRun = false;
      // mock console before requiring printLogo
      console.log = function() { didRun = true; };

      var printLogo = require('../printLogo');
      printLogo();

      expect(didRun).to.be.true;
    });
  });
});
