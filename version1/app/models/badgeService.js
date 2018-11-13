var _ = require('lodash');
var badge = require('gh-badges');

var achievements = require('require-all')({
  dirname: appRoot + '/achievements',
  filter: /(.+achievement)\.js$/,
  excludeDirs: /^\.(git|svn)$/,
  recursive: true
});

var badgeService = {};

badgeService.get = function(req, res) {
  badge.loadFont('./Verdana.ttf', function() {
    badge(
      {
        text: [
          'achievements',
          _.keys(achievements).length
        ],
        colorA: '#894597',
        colorB: '#5d5d5d',
        template: 'flat',
        logo: [
          'data:image/png;base64,iVBORw0KGgoAAAA',
          'NSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJL',
          'R0QA/wD/AP+gvaeTAAAA/0lEQVRYhe3WMU7DM',
          'BjFcadqh0qdWWBl7QU4Ss/AjsREF8RdOhYO0E',
          'qoN2DhFIgBOvBjIIMVxSFyUiEhP8lD7C/v/T9',
          '7sEMoKkoIe+Npn8qpOgCM2VBVVa1ZkzFDcjQd',
          'apDqLIR+u/jnO1AACkABKABdAO9DjHEWfb7lA',
          'LwOAQghXPXx6gJ4zE3GJIRwE0095Zhc4PO3iz',
          '7x7zoq+cB5bifr9tg0AK7xFZXcZYXXZjNs+wB',
          'giofG8hazbIDaeI5dFwAu8dxY2mE+KDyCWGCT',
          'YLj3c86xNliMEh5BVLjFseNEjnVN8pU0BsgSh',
          '5bwA5YnC25AVFjhpR6rk3Zd9K/1Dcae2pUn6m',
          'qiAAAAAElFTkSuQmCC'
        ].join('')
      },
      function(svg) {
        res.setHeader('Content-Type', 'image/svg+xml;charset=utf-8');
        res.setHeader('Pragma-directive', 'no-cache');
        res.setHeader('Cache-directive', 'no-cache');
        res.setHeader('Pragma','no-cache');
        res.setHeader('Expires','0');
        // Cache management - no cache,
        // so it won't be cached by GitHub's CDN.
        res.setHeader('Cache-Control',
          'no-cache, no-store, must-revalidate');

        res.send(svg);
      }
    );
  });
};

module.exports = badgeService;
