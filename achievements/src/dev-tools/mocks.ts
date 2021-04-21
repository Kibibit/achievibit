export class Shall {
  grantedAchievements: { [username: string]: any };

  grant(username, achievementObject) {
    this.grantedAchievements = this.grantedAchievements || {};
    this.grantedAchievements[username] = achievementObject;
  }
}

export class PullRequest {
  title = 'this is a happy little title';
  id = 'test';
  number: number;
  url = 'url';
  organization: { username: string };
  description = '';
  creator = {
    username: 'creator'
  };
  reviewers = [ {
    'username': 'reviewer'
  } ];
  merged: any;
  reviews: any;
  comments: any[];
  inlineComments: any[];
  reactions: any[];
  commits: any[];
  labels: string[];
  createdOn: Date;
  files: { name: string }[];
}
