// CALL THE PACKAGES --------------------
var express = require('express'), // call express
    compression = require('compression'),
    helmet = require('helmet'),
    config = require('./config'),
    path = require('path'),
    favicon = require('serve-favicon'), // set favicon
    bodyParser = require('body-parser'),
    colors = require('colors'),
    logo = require('./printLogo'),
    request = require('request'),
    gulp = require('gulp'),
    cons = require('consolidate'),
    moment = require('moment'),
    _ = require('lodash'),
    badge = require('gh-badges'),
    nconf = require('nconf'),
    ngrok = require('ngrok');

var auth = require('http-auth'); // @see https://github.com/gevorg/http-auth
var scribe = require('scribe-js')(); // used for logs
var async = require('async');
var monk = require('monk');
nconf.argv().env();
var url = nconf.get('databaseUrl');
var db = monk(url);
var app = express(); // define our app using express

var achievements = require('require-all')({
  dirname     :  __dirname + '/achievements',
  filter      :  /(.+achievement)\.js$/,
  excludeDirs :  /^\.(git|svn)$/,
  recursive   : true
});

// use scribe.js for logging
var console = require('./consoleService')('SERVER', ['magenta', 'inverse'], process.console);
var eventManager = require('./eventManager');

var basicAuth = auth.basic({
        realm: "achievibit ScribeJS WebPanel"
    }, function (username, password, callback) {
        var logsUsername = nconf.get('logsUsername') ? nconf.get('logsUsername') + '' : '';
        var logsPassword = nconf.get('logsPassword') ? nconf.get('logsPassword') + '' : '';
        callback(username === logsUsername && password === logsPassword);
    }
);

var io = {};

var publicFolder = __dirname + '/public';

var token = nconf.get('ngrokToken');

// assign the swig engine to .html files
app.engine('html', cons.swig);

// set .html as the default extension
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

// hook helmet to our express app. This adds some protection to each communication with the server
// read more at https://github.com/helmetjs/helmet
app.use(helmet());

// compress all requests
app.use(compression({
  threshold: 0
}));

colors.enabled = true; //enable colors even through piping.

// create application/json parser
var jsonParser = bodyParser.json();

/** ===========
 *   = LOGGING =
 *   = =========
 *   set up logging framework in the app
 *   when NODE_ENV is set to development (like in gulp watch),
 *   don't log at all (TODO: make an exception for basic stuff
 *   like: listening on port: XXXX)
 */
// app.use(scribe.express.logger());
if (nconf.get('logsUsername')) {
  app.use('/logs', auth.connect(basicAuth), scribe.webPanel());
} else {
  app.use('/logs', scribe.webPanel());
}


/** ================
 *   = STATIC FILES =
 *   = ==============
 *   set static files location used for requests that our frontend will make
 */
app.use(express.static(publicFolder));

/** =================
 *   = SERVE FAVICON =
 *   = ===============
 *   serve the favicon.ico so that modern browsers will show a "tab" and favorites icon
 */
app.use(favicon(path.join(__dirname,
    'public', 'assets', 'images', 'favicon.ico')));

app.post('/sendFakeAchievementNotification/:username', jsonParser, function(req, res) {
  if (req.body.secret === process.env.FAKE_SECRET) {
    req.body.secret = undefined;
    io.sockets.emit(req.params.username, {
        avatar : 'https://ifyouwillit.com/wp-content/uploads/2014/06/github1.png',
        name : 'FAKE ACHIEVEMENT!',
        short : 'this is to test achievements',
        description : 'you won\'t get an actual achievement though :-/',
        relatedPullRequest: 'FAKE_IT'
      });
  }

  res.json({
    message: 'b33p b33p! faked a socket.io update'
  });
});

/** ==================
 *   = ROUTES FOR API =
 *   = ================
 *   set the routes for our server's API
 */
app.post('*', jsonParser, function(req, res) {
  console.log('got a post about ' + req.header('X-GitHub-Event'));

  eventManager.notifyAchievements(req.header('X-GitHub-Event'), req.body, io);

  res.json({
    message: 'b33p b33p! got your notification, githubot!'
  });
});

app.get('/achievementsBadge', function(req, res) {
  badge.loadFont('./Verdana.ttf', function(err) {
    badge({ text: ["achievements", _.keys(achievements).length], colorA: "#894597", colorB: "#5d5d5d", template: "flat" },
      function(svg, err) {
        res.setHeader('Content-Type', 'image/svg+xml;charset=utf-8');
        res.send(svg);
      });
  });
});

app.get('/download/extension', function(req, res) {
  var file = __dirname + '/public/achievibit-chrome-extension.crx';
  res.download(file);
});

app.get('/:username', function(req, res) {
  var users = db.get('users');
  var repos = db.get('repos');
  var username = decodeURIComponent(req.params.username);
  async.waterfall([
    function(callback) {
        users.findOne({ username: username }).then(function(user) {
            if (!user) {
                callback(username + ' user not found');
              return;
            }
            var byDate = _.reverse(_.sortBy(user.achievements, ['grantedOn']));
            _.forEach(byDate, function(achievement) {
              achievement.grantedOn = moment(achievement.grantedOn).fromNow();
            });
            callback(null, {
              user: user,
              achievements: byDate
            });
          }, function(error) {
            console.error('problem getting specific user', error);
            callback('request failed for some reason');
          });
    },
    function(pageObject, callback) {
      if (_.result(pageObject.user, 'organizations.length') > 0) {

        var organizationsUsernameArray = [];
        _.forEach(pageObject.user.organizations, function(organizationUsername) {
            organizationsUsernameArray.push({ username: organizationUsername });
        });

        if (organizationsUsernameArray.length > 0) {
          users.find({$or: organizationsUsernameArray}).then(function(userOrganizations) {
            pageObject.user.organizations = userOrganizations;

            callback(null, pageObject);
          }, function(error) {
            console.error('problem getting organizations for user', error);
            pageObject.user.organizations = [];
            callback(null, pageObject);
          });
        } else {
          callback(null, pageObject);
        }
      } else {
        callback(null, pageObject);
      }
    },
    function(pageObject, callback) {
      if (_.result(pageObject.user, 'users.length') > 0) {

        var usersUsernameArray = [];
        _.forEach(pageObject.user.users, function(userUsername) {
            usersUsernameArray.push({ username: userUsername });
        });

        if (usersUsernameArray.length > 0) {
          users.find({$or: usersUsernameArray}).then(function(organizationUsers) {
            pageObject.user.users = organizationUsers;

            callback(null, pageObject);
          }, function(error) {
            console.error('problem getting users for organization', error);
            pageObject.user.organizations = [];
            callback(null, pageObject);
          });
        } else {
          callback(null, pageObject);
        }
      } else {
        callback(null, pageObject);
      }
    },
    function(pageObject, callback) {
        if (!pageObject) {
            callback('failed to get user');
            return;
        }

        var repoFullnameArray = [];
        _.forEach(pageObject.user.repos, function(repoFullname) {
            repoFullnameArray.push({ fullname: repoFullname });
        });

        if (repoFullnameArray.length > 0) {
          repos.find({$or: repoFullnameArray}).then(function(userRepos) {
              pageObject.user.repos = userRepos;

              callback(null, pageObject);
          }, function(error) {
             console.error('problem getting repos for user', error);
             pageObject.user.repos = [];
             callback(null, pageObject);
          });
        } else {
          callback(null, pageObject);
        }

    }
  ], function (err, pageData) {
    if (err) {
        res.redirect(301, '/');
        return;
    }

    res.render('blog' , pageData);
});
});

app.get('/raw/:username', function(req, res) {
  var users = db.get('users');
  var username = decodeURIComponent(req.params.username);
  users.findOne({ username: username }).then(function(user) {
    if (!user) {
      res.status(204).send('no user found');
      return;
    }
    // var byDate = _.sortBy(user.achievements, ['grantedOn']);
    // _.forEach(byDate, function(achievement) {
    //   achievement.grantedOn = moment(achievement.grantedOn).fromNow();
    // });
    res.json(user);
  }, function() {
    res.status(500).send('something went wrong');
  });
});

/** =============
 *   = FRONT-END =
 *   = ===========
 *   Main 'catch-all' route to send users to frontend
 */
/* NOTE(thatkookooguy): has to be registered after API ROUTES */
app.get('/', function(req, res) {
  var users = db.get('users');
  var repos = db.get('repos');
  users.find({}).then(function(allUsers) {
    repos.find({}).then(function(allRepos) {
      var allOrganizations = _.remove(allUsers, 'organization');

      res.render('index' , {
        users: allUsers,
        organizations: allOrganizations,
        repos: allRepos
      });
    }, function(error) {
      console.error('problem getting repos', error);
    });
  }, function(error) {
    console.error('problem getting users', error);
  });
  //res.sendFile(path.join(publicFolder + '/index.html'));
});

/** ==========
 *   = SERVER =
 *   = ========
 */
var server = app.listen(config.port, function() {
    var stealth = nconf.get('stealth');
    if (!stealth) {
        logo();
    }
  console.info('Server listening at port ' +
    colors.bgBlue.white.bold(' ' + config.port + ' '));
});
var io = require('socket.io').listen(server);

// Emit welcome message on connection
io.on('connection', function(socket) {
    var username = socket && socket.handshake && socket.handshake.query && socket.handshake.query.githubUsername
    if (username) {
      console.log('USER CONNECTED: ' + username);
    } else {
      console.log('ANONYMOUS USER CONNECTED!');
    }
});



if (token) {
    ngrok.authtoken(token, function(err, token) {
        if (err) {
            console.error(err);
        }
    });
    ngrok.connect(config.port, function (err, url) {
        if (err) {
            console.error(err);
        } else {
            console.info(colors.cyan('ngrok') + ' - serving your site from ' + colors.yellow(url));
        }
    });
}
