import { IAchievement } from './achievement.abstract';

export const labelBabyJunior: IAchievement = {
  name: 'Label Baby Junior',
  check: function(pullRequest, shall) {
    if (isManyLabels(pullRequest))  {
      const achievement = {
        avatar: 'images/achievements/labelBabyJunior.achievement.jpg',
        name: 'The Label Maker',
        short: 'Is this a label maker?',
        description: [
          'You\'ve put many labels, thank you for organizing. ',
          'You\'re a gift that keeps on re-giving'
        ].join(''),
        relatedPullRequest: pullRequest.id
      };

      shall.grant(pullRequest.creator.username, achievement);
    }
  }
};

function isManyLabels(pullRequest) {
  const labels = pullRequest.labels;
  return labels && labels.length > 5;
}
