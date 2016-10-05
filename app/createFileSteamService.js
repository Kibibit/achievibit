var gulp = require('gulp'),
    gutil = require('gulp-util');

var createFileStreamService = {};

createFileStreamService.create = function string_src(filename, string) {
  var src = require('stream').Readable({ objectMode: true })
  src._read = function () {
    this.push(new gutil.File({
      cwd: '',
      base: '',
      path: filename,
      contents: new Buffer(string)
    }))
    this.push(null)
  }
  return src
};

module.exports = createFileStreamService;
