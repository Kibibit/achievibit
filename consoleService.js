var scribeConsole = function(tag, colors, _console) {
  var _ = require('lodash');
  colors = colors ? colors : 'red';
  return {
    log: function() {
      var self = _console.time().tag({msg: tag, colors: colors});
      self.info.apply(self, arguments);
    },
    error: function() {
      var self = _console.time().tag({msg: tag, colors: colors});
      self.error.apply(self, arguments);
    },
    warn: function() {
      var self = _console.time().tag({msg: tag, colors: colors});
      self.warn.apply(self, arguments);
    },
    info: function() {
      var self = _console.time().tag({msg: tag, colors: colors});
      self.info.apply(self, arguments);
    },
    debug: function() {
      var self = _console.time().tag({msg: tag, colors: colors});
      self.debug.apply(self, arguments);
    },
    customConsole: _console
  };
};

module.exports = scribeConsole;
