import { endsWith, every, forEach } from 'lodash';

import { IAchievement, IUserAchievement } from './achievement.abstract';

export const neverGoFullRetard: IAchievement = {
  name: 'never go full retard',
  check: function(pullRequest, shall) {
    if (pullRequest.files && pullRequest.files.length > 0 &&
			every(pullRequest.files, isAnImage)) {

      const achieve: IUserAchievement = {
        avatar: 'images/achievements/neverGoFullRetard.achievement.png',
        name: 'never go full retard',
        short: 'Nigga, You Just Went Full Retard',
        description: 'merged a pull request containing only pictures. pretty!',
        relatedPullRequest: pullRequest.id
      };
      shall.grant(pullRequest.creator.username, achieve);
      forEach(pullRequest.reviewers, function(reviewer) {
        shall.grant(reviewer.username, achieve);
      });
    }
  }
};

function isAnImage(file: any) {
  return typeof file === 'object' && file.name &&
		(endsWith(file.name, '.png') ||
			endsWith(file.name, '.jpg') ||
			endsWith(file.name, '.jpeg') ||
			endsWith(file.name, '.ico') ||
			endsWith(file.name, '.svg') ||
			endsWith(file.name, '.gif') ||
			endsWith(file.name, '.icns'));
}
