// CALL THE PACKAGES --------------------
var path = require('path');
global.appRoot = path.resolve(__dirname);
global.io = {};
var scribe = require('scribe-js')();
var sslRedirect = require('heroku-ssl-redirect');
var express = require('express'); // call express
var config = require('./config');
var compression = require('compression');
var helmet = require('helmet');
var favicon = require('serve-favicon'); // set favicon
var bodyParser = require('body-parser');
var colors = require('colors');
var logo = require('./printLogo');
var nunjucks = require('nunjucks');
var _ = require('lodash');
var ngrok = require('ngrok');
var swaggerUi = require('swagger-ui-express');
var swaggerJSDoc = require('swagger-jsdoc');

// use scribe.js for logging
var console = require('./app/models/consoleService')();

var app = express(); // define our app using express

// enable ssl redirect
app.use(sslRedirect());

//Nunjucks setup
nunjucks.configure('views', {
  autoescape: true,
  express: app
});

app.set('view engine', 'nunjucks');

// app.set('view engine', 'html');
app.set('views', __dirname + '/views');

var configService = require('./app/models/configurationService')();
var privateConfig = configService.get();

var port = privateConfig.port;
var url = privateConfig.databaseUrl;
var stealth = privateConfig.stealth;
var dbLibrary = privateConfig.testDB ? 'monkey-js' : 'monk';
var monk = require(dbLibrary);
var db = monk(url);

if (!port) {
  port = config.port;
}

var publicFolder = __dirname + '/public';

var token = privateConfig.ngrokToken;

//TEMP HEADERS FOR ANGULAR 2 TEST
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers',
    'X-Requested-With,content-type');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  next();
});

// hook helmet to our express app. This adds some protection to each
// communication with the server.
// read more at https://github.com/helmetjs/helmet
app.use(helmet());

// compress all requests
app.use(compression({
  threshold: 0
}));

colors.enabled = true; //enable colors even through piping.

// create application/json parser
var jsonParser = bodyParser.json();

/**  = ========================= =
 *   = API DOCUMENTATION SWAGGER =
 *   = ========================= =
*/
var spec = swaggerJSDoc({
  swaggerDefinition: {
    info: {
      title: 'achievibit',
      version: '1.0.0'
    },
    produces: [ 'application/json' ],
    consumes: [ 'application/json' ],
    securityDefinitions: {
      jwt: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header'
      }
    },
    security: [
      { jwt: [] }
    ]
  },
  apis: [
    'app/routes/*.js'
  ]
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec));

/** ===========
 *   = LOGGING =
 *   = =========
 *   set up logging framework in the app
 *   when NODE_ENV is set to development (like in gulp watch),
 *   don't log at all (TODO: make an exception for basic stuff
 *   like: listening on port: XXXX)
 */
// app.use(scribe.express.logger());
if (configService.haveLogsAuth) {
  app.use('/logs', configService.createLogsAuthForExpress(), scribe.webPanel());
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
 *   serve the favicon.ico so that modern browsers will show a "tab" and
 *   favorites icon
 */
app.use(favicon(path.join(__dirname,
  'public', 'assets', 'images', 'favicon.ico')));

/** ==================
 *   = ROUTES FOR API =
 *   = ================
 *   set the routes for our server's API
 */
var apiRoutes = require('./app/routes/api')(app, express);
app.use('/', jsonParser, apiRoutes);

// app.get('/download/extension', function(req, res) {
//   var file = __dirname + '/public/achievibit-chrome-extension.crx';
//   res.download(file);
// });

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
var server = app.listen(port, function() {
  if (!stealth) {
    logo();
  }
  console.info('Server listening at port ' +
    colors.bgBlue.white.bold(' ' + port + ' '));
});

global.io = require('socket.io').listen(server);

// Emit welcome message on connection
global.io.on('connection', function(socket) {
  var username = socket &&
    socket.handshake &&
    socket.handshake.query &&
    socket.handshake.query.githubUsername;

  if (username) {
    console.log('USER CONNECTED: ' + username);
  } else {
    console.log('ANONYMOUS USER CONNECTED!');
  }
});


if (token) {
  ngrok.authtoken(token, function(err) {
    if (err) {
      console.error(err);
    }
  });
  ngrok.connect(port, function (err, url) {
    if (err) {
      console.error(err);
    } else {
      console.info([
        colors.cyan('ngrok'),
        ' - serving your site from ',
        colors.yellow(url)
      ].join(''));
    }
  });
}
