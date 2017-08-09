var achievibitDB = require('../../achievibitDB');

var githubService = {};

githubService.createWebhook = function(req, res) {
  var repo = req.query.repo;
  var githubToken = req.query.githubToken;
  var firebaseToken = req.query.firebaseToken;
  var newState = req.query.newState;

  if (githubToken) {
    defaultAuth.verifyIdToken(firebaseToken)
      .then(function(decodedToken) {
        var uid = decodedToken.uid;
        if (newState === 'true') {
          achievibitDB.createAchievibitWebhook(repo, githubToken, uid);
        } else {
          achievibitDB.deleteAchievibitWebhook(repo, githubToken, uid);
        }

        res.json({ msg: 'webhook added' });
      });
  } else {
    res.status(401).send('missing authorization header');
  }
};

module.exports = githubService;
