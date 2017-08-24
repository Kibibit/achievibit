var _ = require('lodash');
var badgeService = require('../models/badgeService');
var userService = require('../models/userService');
var eventManager = require('../../eventManager');
var githubService = require('../models/githubService');
var mockService = require('../models/mockService');

module.exports = function(app, express) {

  var apiRouter = express.Router();

  apiRouter.route('/achievementsShield')
    .get(badgeService.get);

  apiRouter.route('/authUsers')
    .get(function(req, res) {
      var userParams = req.query;

      userService.getAuthUserData(
        userParams.firebaseToken,
        userParams.githubToken,
        userParams.githubUsername,
        userParams.timezone).then(function(data) {
        res.json({
          achievibitUserData:
            _.omit(data.newUser, ['_id', 'githubToken', 'uid'])
        });
      }, function(error) {
        res.status(error.code).send(error.msg);
      });
    });

  apiRouter.route('/createWebhook')
    .get(githubService.createWebhook);

  apiRouter.route('/sendFakeAchievementNotification/:username')
    .post(mockService.mockAchievementNotification);

  apiRouter.route('/raw/:username')
    .get(function(req, res) {
      var username = decodeURIComponent(req.params.username);

      userService.getMinimalUser(username).then(function(user) {
        res.json(user);
      }, function(error) {
        res.status(error.code).send(error.msg);
      });
    });

  apiRouter.route('/:username')
    .get(function(req, res) {
      var username = decodeURIComponent(req.params.username);

      userService.getFullUser(username).then(function(data) {
        res.render('blog' , data.pageData);
      }, function(error) {
        if (error.code === 301) {
          res.redirect(error.code, error.redirect);
        } else {
          res.status(error.code).send(error.msg);
        }
      });
    });

  apiRouter.route('*')
    .post(eventManager.postFromWebhook);

  return apiRouter;
};
