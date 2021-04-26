/**
 * Github Webhook event types
 * https://developer.github.com/v3/activity/events/types/
 */
 export interface IGithubUser {
  login: string;
  id: number;
  avatar_url: string;
  gravatar_id: number;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

export interface IGithubRepo {
  id: number;
  name: string;
  full_name: string;
  owner: IGithubUser;
  private: boolean;
  html_url: string;
  description: string;
  fork: boolean;
  url: string;
  forks_url: string;
  keys_url: string;
  collaborators_url: string;
  teams_url: string;
  hooks_url: string;
  issue_events_url: string;
  events_url: string;
  assignees_url: string;
  branches_url: string;
  tags_url: string;
  blobs_url: string;
  git_tags_url: string;
  git_refs_url: string;
  trees_url: string;
  statuses_url: string;
  languages_url: string;
  stargazers_url: string;
  contributors_url: string;
  subscribers_url: string;
  subscription_url: string;
  commits_url: string;
  git_commits_url: string;
  comments_url: string;
  issue_comment_url: string;
  contents_url: string;
  compare_url: string;
  merges_url: string;
  archive_url: string;
  downloads_url: string;
  issues_url: string;
  pulls_url: string;
  milestones_url: string;
  notifications_url: string;
  labels_url: string;
  releases_url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  git_url: string;
  ssh_url: string;
  clone_url: string;
  svn_url: string;
  homepage: string;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string;
  has_issues: boolean;
  has_downloads: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  forks_count: number;
  mirror_url: string;
  open_issues_count: number;
  forks: number;
  open_issues: number;
  watchers: number;
  default_branch: string;
}

export interface IGithubPullRequest {
  url: string;
  id: number;
  html_url: string;
  diff_url: string;
  patch_url: string;
  issue_url: string;
  'number': number;
  state: string;
  locked: boolean;
  title: string;
  user: IGithubUser;
  body: string;
  created_at: string;
  updated_at: string;
  closed_at: string;
  merged_at: string;
  merge_commit_sha: string;
  assignee: string;
  assignees: IGithubUser[];
  milestone: string;
  commits_url: string;
  review_comments_url: string;
  review_comment_url: string;
  comments_url: string;
  statuses_url: string;
  head: {
    label: string;
    ref: string;
    sha: string;
    user: IGithubUser;
    repo: IGithubRepo;
  };
  base: {
    label: string;
    ref: string;
    sha: string;
    user: IGithubUser;
    repo: IGithubRepo;
  };
  _links: {
    self: {
      href: string;
    };
    html: {
      href: string;
    };
    issue: {
      href: string;
    };
    comments: {
      href: string;
    };
    review_comments: {
      href: string;
    };
    review_comment: {
      href: string;
    };
    commits: {
      href: string;
    };
    statuses: {
      href: string;
    };
  };
  merged: boolean;
  mergeable: string;
  mergeable_state: string;
  merged_by: string;
  comments: number;
  review_comments: number;
  commits: number;
  additions: number;
  deletions: number;
  changed_files: number;
}

export interface IGithubChanges {
    title?: {
      from: string;
    };
    body?: {
      from: string;
    };
}

export interface IGithubReviewComment {
  id: string;
  pull_request_review_id: string;
  user: IGithubUser;
  body: string;
  created_at: string;
  updated_at: string;
  url: string;
  path: string;
  commit_id: string;
}

export interface IGithubReview {
  id: string;
  user: IGithubUser;
  body: string;
  state: string;
  submitted_at: string;
  commit_id: string;
  author_association: string;
}

/**
 * https://developer.github.com/v3/activity/events/types/#pullrequestevent
 */
export interface IGithubPullRequestEvent {
  action: string;
  number: number;
  pull_request: IGithubPullRequest;
  repository: IGithubRepo;
  sender: IGithubUser;
  label?: { name: string };
  changes?: IGithubChanges;
  requested_reviewer?: IGithubUser;
  comment?: IGithubReviewComment;
  review?: IGithubReview;
}
