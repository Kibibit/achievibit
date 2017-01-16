var scribeConsole = function(tag, colors, _console) {
  var _ = require('lodash');
  colors = colors ? colors : 'red';
  return {
    log: function(text) {
      var self = _console.time().tag({msg: tag, colors: colors});
      self.info.apply(self, arguments);
    },
    error: function(text) {
      var self = _console.time().tag({msg: tag, colors: colors});
      self.error.apply(self, arguments);
    },
    warn: function(text) {
      var self = _console.time().tag({msg: tag, colors: colors});
      self.warn.apply(self, arguments);
    },
    info: function(text) {
      var self = _console.time().tag({msg: tag, colors: colors});
      self.info.apply(self, arguments);
    },
    debug: function(text) {
      var self = _console.time().tag({msg: tag, colors: colors});
      self.debug.apply(self, arguments);
    },
    customConsole: _console
  };
};

module.exports = scribeConsole;
