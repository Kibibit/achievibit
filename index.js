// var githubhook = require('githubhook');
// var githubEvents = githubhook({
// 	port: process.env.PORT || 3420,
// 	secret: 'k1b1b0t@kibibit'
// });
// var github = require('octonode');

// //var ghrepo = client.repo('pksunkara/hub');

// // ghrepo.status('18e129c213848c7f239b93fe5c67971a64f183ff', {
// //   "state": "success",
// //   "target_url": "http://ci.mycompany.com/job/hub/3",
// //   "description": "Achievement UNLOCKED: implementing achievment system"
// // }, function() {
// // 	console.log('status added successfully!');
// // });

// githubEvents.listen();


// githubEvents.on('*', function (event, repo, ref, data) {
// 	console.log(data);
// });

// githubEvents.on('event', function (repo, ref, data) {
// 	console.log(data);
// });

// githubEvents.on('event:kibibit/kibibit-code-editor', function (ref, data) {
// 	console.log(data);
// });

// githubEvents.on('event:kibibit/kibibit-code-editor:ref', function (data) {
// 	console.log(data);
// });

// githubEvents.on('kibibit/kibibit-code-editor', function (event, ref, data) {
// 	console.log(data);
// });

// githubEvents.on('kibibit/kibibit-code-editor:ref', function (event, data) {
// 	console.log(data);
// });


// BASE SETUP
// ======================================

// CALL THE PACKAGES --------------------
var express = require('express'), // call express
    compression = require('compression'),
    helmet = require('helmet'),
    config = require('./config'),
    path = require('path'),
    favicon = require('serve-favicon'), // set favicon
    bodyParser = require('body-parser'),
    colors = require('colors'),
    logo = require('./printLogo');
var app = express(); // define our app using express
var scribe = require('scribe-js')(); // used for logs
var console = process.console;

var publicFolder = __dirname + '/public';

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
app.use(scribe.express.logger());
app.use('/logs', scribe.webPanel());

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

/** ==================
 *   = ROUTES FOR API =
 *   = ================
 *   set the routes for our server's API
 */
app.post('*', function(req, res) {
  console.log('got a post request!');
  res.status(200);
});

/** =============
 *   = FRONT-END =
 *   = ===========
 *   Main 'catch-all' route to send users to frontend
 */
/* NOTE(thatkookooguy): has to be registered after API ROUTES */
app.get('*', function(req, res) {
  res.sendFile(path.join(publicFolder + '/index.html'));
});

/** ==========
 *   = SERVER =
 *   = ========
 */
app.listen(config.port, function() {
  logo();
  console.info('Server listening at port ' +
    colors.bgBlue.white.bold(' ' + config.port + ' '));
});
