import { IAchievement, IUserAchievement } from './achievement.abstract';

export const dontYellAtMe: IAchievement = {
  name: 'Don\'t Yell At Me!!!',
  check: function(pullRequest, shall) {
    const reason = isCreatorJustMean(pullRequest);

    if (reason) {

      const achieve: IUserAchievement = {
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
  const cleanedTitle = pullRequest.title.replace(/\[.*?\]/g, '');
  const isTitleContainLetters = /[a-zA-Z]/.test(cleanedTitle);
  const isNoLowerCase = /^[^a-z]*$/.test(cleanedTitle);
  const isOverExclamation = /!{3}/.test(cleanedTitle);

  let reason = '';
  let comboPotential = '';

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
