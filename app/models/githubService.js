var achievibitDB = require('../../achievibitDB');
var userService = require('./userService');
var defaultAuth = userService.getFirebaseAdminAuth();

var githubService = {};

githubService.createWebhook = function(req, res) {
  var repo = req.query.repo;
  var firebaseToken = req.query.firebaseToken;
  var newState = req.query.newState;

  if (firebaseToken) {
    defaultAuth.verifyIdToken(firebaseToken)
      .then(function(decodedToken) {
        var uid = decodedToken.uid;
        achievibitDB.getAndUpdateUserData(uid)
          .then(function(user) {
            if (newState === 'true') {
              achievibitDB.createAchievibitWebhook(repo, user.githubToken, uid);
            } else {
              achievibitDB.deleteAchievibitWebhook(repo, user.githubToken, uid);
            }

            res.json({ msg: 'webhook ' + newState ? 'added' : 'deleted' });
          });
      });
  } else {
    res.status(401).send('missing authorization header');
  }
};

module.exports = githubService;
