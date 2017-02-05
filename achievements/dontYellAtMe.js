var moment = require('moment');

var member = {
  name: 'Don\'t Yell At Me!!!',
  check: function(pullRequest, shall) {
    var reason = isCreatorJustMean(pullRequest);

    if (reason) {

      var achieve = {
        avatar: 'images/achievements/dontYellAtMe.jpg',
        name: 'Don\'t Yell At Me!!!',
        short: 'I don\'t know what we\'re yelling about',
        description: 'You\'ve used ' + reason + ' in your Pull Request title',
        relatedPullRequest: pullRequest.id
      };

      shall.grant(pullRequest.creator.username, achieve);
    }
  }
};

function isCreatorJustMean(pullRequest) {
  var isTitleContainLetters = /[a-zA-Z]/.test(pullRequest.title);
  var isNoLowerCase = /^[^a-z]/.test(pullRequest.title);
  var isOverExclamation = /!{3}/.test(pullRequest.title);

  var reason = '';
  var comboPotential = '';

  if (isTitleContainLetters && isNoLowerCase) {
    reason += 'ALL CAPS';
    comboPotential = ' and ';
  }

  if (isOverExclamation) {
    reason += comboPotential + '3 or more exclamation marks';
  }

  return reason;
}

module.exports = member;
