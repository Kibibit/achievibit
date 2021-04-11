var badgeService = require('../models/badgeService');
var userService = require('../models/userService');
var eventManager = require('../../eventManager');
var githubService = require('../models/githubService');
var mockService = require('../models/mockService');

module.exports = function(app, express) {

  var apiRouter = express.Router();

  /**
   * @swagger
   * /achievementsShield:
   *   get:
   *     summary: Generates an achievibit shield
   *     description:
   *       >
   *         This will return an SVG file with the number of achievements
   *         achievibit offers to add to markdown files
   *     tags:
   *       - Shield
   *     responses:
   *       200:
   *         description: Number of achievements badge in SVG format
   */
  apiRouter.route('/achievementsShield')
    .get(badgeService.get);

  /**
   * @swagger
   * /authUsers:
   *   get:
   *     summary: Get authenticated user data
   *     tags:
   *       - User
   *     responses:
   *       200:
   *         schema:
   *           type: object
   *           properties:
   *             id:
   *               type: integer
   *             username:
   *               type: string
   *         examples:
   *           application/json: {
   *             "id": 1,
   *             "username": "someuser"
   *           }
   *       409:
   *         description: When the username is already in use
   */
  apiRouter.route('/authUsers')
    .get(function(req, res) {
      var userParams = req.query;

      userService.getAuthUserData(
        userParams.firebaseToken,
        userParams.githubToken,
        userParams.githubUsername,
        userParams.timezone).then(function(data) {
        res.json({
          achievibitUserData: _.omit(data.newUser, [
            '_id',
            'githubToken',
            'uid'
          ])
        });
      }, function(error) {
        res.status(error.code).send(error.msg);
      });
    });

  /**
   * @swagger
   * /createWebhook:
   *   get:
   *     summary: create an achievibit webhook for a GitHub authenticated user
   *     tags:
   *       - User
   *     responses:
   *       200:
   *         schema:
   *           type: object
   *           properties:
   *             id:
   *               type: integer
   *             username:
   *               type: string
   *         examples:
   *           application/json: {
   *             "id": 1,
   *             "username": "someuser"
   *           }
   *       409:
   *         description: When the username is already in use
   */
  apiRouter.route('/createWebhook')
    .get(githubService.createWebhook);

  apiRouter.route('/sendFakeAchievementNotification/:username')
    .post(mockService.mockAchievementNotification);

  /**
   * @swagger
   * /raw/{username}:
   *   get:
   *     summary: create an achievibit webhook for a GitHub authenticated user
   *     tags:
   *       - User
   *     responses:
   *       200:
   *         schema:
   *           type: object
   *           properties:
   *             id:
   *               type: integer
   *             username:
   *               type: string
   *         examples:
   *           application/json: {
   *             "id": 1,
   *             "username": "someuser"
   *           }
   *       409:
   *         description: When the username is already in use
   */
  apiRouter.route('/raw/:username')
    .get(function(req, res) {
      var username = decodeURIComponent(req.params.username);

      userService.getMinimalUser(username).then(function(user) {
        res.json(user);
      }, function(error) {
        res.status(error.code).send(error.msg);
      });
    });

  /**
   * @swagger
   * /{username}:
   *   get:
   *     summary: create an achievibit webhook for a GitHub authenticated user
   *     tags:
   *       - User
   *       - Raw Data
   *     responses:
   *       200:
   *         schema:
   *           type: object
   *           properties:
   *             id:
   *               type: integer
   *             username:
   *               type: string
   *         examples:
   *           application/json: {
   *             "id": 1,
   *             "username": "someuser"
   *           }
   *       409:
   *         description: When the username is already in use
   */
  apiRouter.route('/:username')
    .get(function(req, res) {
      var username = decodeURIComponent(req.params.username);

      userService.getFullUser(username).then(function(data) {
        res.render('blog', data.pageData);
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
