export interface IShall {
  grant(username: string, achievement: IUserAchievement): void;
}

export interface IAchievement {
  name: string;
  check(pullRequest: any, shall: IShall): void;
}

export interface IUserAchievement {
  name: string;
  avatar: string;
  short: string;
  description: string;
  relatedPullRequest: string;
}
