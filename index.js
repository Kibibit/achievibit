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
    eventManager = require('./eventManager'),
    cons = require('consolidate'),
    moment = require('moment'),
    _ = require('lodash'),
    ngrok = require('ngrok');

var monk = require('monk');
var url = process.env.MONGOLAB_URI;
var db = monk(url);
var app = express(); // define our app using express
//var scribe = require('scribe-js')(); // used for logs
//var console = process.console;

var io = {};

var publicFolder = __dirname + '/public';

var token = '';

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
//app.use(scribe.express.logger());
//app.use('/logs', scribe.webPanel());

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

app.post('sendFakeAchievementNotification/:username', jsonParser, function(req, res) {
  if (req.body.secret === process.env.FAKE_SECRET) {
    req.body.secret = undefined;
    io.sockets.emit(req.params.username, req.body);
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

app.get('/download/extension', function(req, res) {
  var file = __dirname + '/public/achievibit-chrome-extension.crx';
  res.download(file);
});

app.get('/:username', function(req, res) {
  var users = db.get('users');
  users.findOne({ username: req.params.username }).then(function(user) {
    if (!user) {
      res.redirect(301, '/');
      return;
    }
    var byDate = _.sortBy(user.achievements, ['grantedOn']);
    _.forEach(byDate, function(achievement) {
      achievement.grantedOn = moment(achievement.grantedOn).fromNow();
    });
    res.render('blog' , {
      user: user,
      achievements: byDate
    });
  }, function() {
    res.redirect(301, '/');
  });
});

app.get('/raw/:username', function(req, res) {
  var users = db.get('users');
  users.findOne({ username: req.params.username }).then(function(user) {
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
    });
  });
  //res.sendFile(path.join(publicFolder + '/index.html'));
});

/** ==========
 *   = SERVER =
 *   = ========
 */
var server = app.listen(config.port, function() {
  logo();
  console.info('Server listening at port ' +
    colors.bgBlue.white.bold(' ' + config.port + ' '));
});
var io = require('socket.io').listen(server);

// Emit welcome message on connection
io.on('connection', function(socket) {
    console.log('user connected!');
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
