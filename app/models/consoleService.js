var scribe = require('scribe-js')(); // used for logs
var console = null;

var achievibitConsole = function() {
  if (!console) {
    console = scribe.console({
      console: {
        alwaysTime: true,
        alwaysLocation: true
      }
    });
  }

  return console;
};

module.exports = achievibitConsole;
