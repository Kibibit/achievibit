var console = require('../models/consoleService')();
var badgeService = require('../models/badgeService');
var userService = require('../models/userService');
var eventManager = require('../../eventManager');
var githubService = require('../models/githubService');
var mockService = require('../models/mockService');

module.exports = function(app, express) {

  var apiRouter = express.Router();

  apiRouter.route('/achievementsShield')
    .get(badgeService.get);

  apiRouter.route('/raw/:username')
    .get(userService.getMinimalUser);

  apiRouter.route('/:username')
    .get(userService.getFullUser);

  apiRouter.route('/authUsers')
    .get(userService.getAuthUserData);

  apiRouter.route('/createWebhook')
    .get(githubService.createWebhook);

  apiRouter.route('/sendFakeAchievementNotification/:username')
    .post(mockService.mockAchievementNotification);

  apiRouter.route('*')
    .post(eventManager.postFromWebhook);

  return apiRouter;
};
