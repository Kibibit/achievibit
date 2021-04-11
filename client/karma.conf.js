// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma'),
      require('karma-spec-reporter'),
      require('karma-htmlfile-reporter')
    ],
    client: {
      captureConsole: false,
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    preprocessors: {
      'src/**/*!(test|spec).ts': ['coverage']
    },
    // coverageIstanbulReporter: {
    //   dir: require('path').join(__dirname, '../coverage/client'),
    //   reports: ['html', 'lcovonly', 'text-summary'],
    //   fixWebpackSourcePaths: true
    // },
    coverageReporter: {
      // type : 'html',
      dir : '../test-results/client/coverage',
      reporters: [
        { type: 'lcov', subdir: 'report-lcov' },
        { type: 'html', subdir: 'report-html' }
      ],
      fixWebpackSourcePaths: true
    },
    
    reporters: ['spec', 'html'],
    htmlReporter: {
      outputFile: '../test-results/client/index.html',
			
      // Optional
      pageTitle: 'Client-Side Unit Tests',
      subPageTitle: 'A summary of test results',
      groupSuites: true,
      useCompactStyle: true,
      useLegacyStyle: true,
      showOnlyFailed: false
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: [ 'Chrome_without_sandbox' ],
    customLaunchers: {
      Chrome_without_sandbox: {
        base: 'ChromeHeadless',
        flags: [ '--no-sandbox' ] // with sandbox it fails under Docker
      }
    },
    singleRun: false,
    restartOnFileChange: true
  });
};
