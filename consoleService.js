var scribeConsole = function(tag, colors, _console) {
  colors = colors ? colors : 'red';
  return {
    log: function(text) {
      _console.time().tag({msg: tag, colors: colors})
            .info(text);
    },
    error: function(text) {
      _console.time().tag({msg: tag, colors: colors})
            .error(text);
    },
    warn: function(text) {
      _console.time().tag({msg: tag, colors: colors})
            .warn(text);
    },
    info: function(text) {
      _console.time().tag({msg: tag, colors: colors})
            .info(text);
    },
    debug: function(text) {
      _console.time().tag({msg: tag, colors: colors})
            .debug(text);
    },
    customConsole: _console
  };
};

module.exports = scribeConsole;
