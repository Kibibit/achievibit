var dontYellAtMe = {
  name: 'Don\'t Yell At Me!!!',
  check: function(pullRequest, shall) {
    var reason = isCreatorJustMean(pullRequest);

    if (reason) {

      var achieve = {
        avatar: 'images/achievements/dontYellAtMe.achievement.jpg',
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
  var cleanedTitle = pullRequest.title.replace(/\[.*?\]/g, '');
  var isTitleContainLetters = /[a-zA-Z]/.test(cleanedTitle);
  var isNoLowerCase = /^[^a-z]*$/.test(cleanedTitle);
  var isOverExclamation = /!{3}/.test(cleanedTitle);

  var reason = '';
  var comboPotential = '';

  if (isTitleContainLetters) {
    if (isNoLowerCase) {
      reason += 'ALL CAPS';
      comboPotential = ' and ';
    }
    
    if (isOverExclamation) {
      reason += comboPotential + '3 or more exclamation marks';
    }
  }
  
  return reason;
}

module.exports = dontYellAtMe;
