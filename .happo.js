// .happo.js
// =========

var FirefoxTarget = require('happo-target-firefox');

module.exports = {
  // ...

  targets: [
    // ...
    new FirefoxTarget({
      // an overridable name to identify the target
      // (useful for running a specific target from the CLI.)
      // (default: 'firefox')
      name: 'firefox',

      // Control the interface on which the local server listens (defaults to 'localhost')
      // (default: 'localhost')
      bind: '0.0.0.0',

      // Control the port used for the local server
      // (default: 4567)
      port: 7777,

      // List javascript source files. These can be files or raw URLs.
      // (default: [])
      sourceFiles: [
        'https://unpkg.com/jquery@3.1.1',
        // 'application.js',
        'happo-examples.js',
      ],

      // List css source files. These can also be files or raw URLs.
      // (default: [])
      stylesheets: [
        'application.css',
      ],

      // List directories where public files are accessible (useful for e.g. font files)
      // (default: [])
      publicDirectories: [
        'public',
      ],

      // Configure the window size when taking snapshots
      // (defaults shown below)
      viewports: {
        large: {
          width: 1024,
          height: 768,
        },
        medium: {
          width: 640,
          height: 888,
        },
        small: {
          width: 320,
          height: 444,
        },
      },
    }),
  ],
};
