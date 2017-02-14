module.exports = function helper(fn) {
  var originalConsoleLog = console.log;

  function restore() {
    console.log = originalConsoleLog;
  }

  if (fn.length) {
    fn(restore);
  } else {
    fn();
    restore();
  }
};
