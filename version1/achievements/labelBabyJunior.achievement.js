var labelBabyJunior = {
  name: 'Label Baby Junior',
  check: function(pullRequest, shall) {
    if (isManyLabels(pullRequest))  {
      var achievement = {
        avatar: 'images/achievements/labelBabyJunior.achievement.jpg',
        name: 'The Label Maker',
        short: 'Is this a label maker?',
        description: [
          'You\'ve put many labels, thank you for organizing. ',
          'You\'re a gift that keeps on re-giving'
        ].join(''),
        relatedPullRequest: pullRequest._id
      };

      shall.grant(pullRequest.creator.username, achievement);
    }
  }
};

function isManyLabels(pullRequest) {
  var labels = pullRequest.labels;
  return labels && labels.length > 5;
}

module.exports = labelBabyJunior;
