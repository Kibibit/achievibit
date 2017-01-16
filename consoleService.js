var scribeConsole = function(tag, colors, _console) {
  var _ = require('lodash');
  colors = colors ? colors : 'red';
  return {
    log: function(text) {
      _console.time().tag({msg: tag, colors: colors})
            .info(text, _.drop(arguments));
    },
    error: function(text) {
      _console.time().tag({msg: tag, colors: colors})
            .error(text, _.drop(arguments));
    },
    warn: function(text) {
      _console.time().tag({msg: tag, colors: colors})
            .warn(text, _.drop(arguments));
    },
    info: function(text) {
      _console.time().tag({msg: tag, colors: colors})
            .info(text), _.drop(arguments);
    },
    debug: function(text) {
      _console.time().tag({msg: tag, colors: colors})
            .debug(text, _.drop(arguments));
    },
    customConsole: _console
  };
};

module.exports = scribeConsole;
