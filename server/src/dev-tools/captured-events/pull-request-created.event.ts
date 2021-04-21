// tslint: disable
export const pullRequestCreatedEvent = {
  event: 'pull_request',
  payload: {
    action: 'opened',
    number: 1,
    pull_request: {
      url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/pulls/1',
      id: 352423539,
      node_id: 'MDExOlB1bGxSZXF1ZXN0MzUyNDIzNTM5',
      html_url: 'https://github.com/Thatkookooguy/test-new-achievibit-events/pull/1',
      diff_url: 'https://github.com/Thatkookooguy/test-new-achievibit-events/pull/1.diff',
      patch_url: 'https://github.com/Thatkookooguy/test-new-achievibit-events/pull/1.patch',
      issue_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/issues/1',
      number: 1,
      state: 'open',
      locked: false,
      title: 'Create test-event.ts',
      user: {
        login: 'Thatkookooguy',
        id: 10427304,
        node_id: 'MDQ6VXNlcjEwNDI3MzA0',
        avatar_url: 'https://avatars3.githubusercontent.com/u/10427304?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/Thatkookooguy',
        html_url: 'https://github.com/Thatkookooguy',
        followers_url: 'https://api.github.com/users/Thatkookooguy/followers',
        following_url: 'https://api.github.com/users/Thatkookooguy/following{/other_user}',
        gists_url: 'https://api.github.com/users/Thatkookooguy/gists{/gist_id}',
        starred_url: 'https://api.github.com/users/Thatkookooguy/starred{/owner}{/repo}',
        subscriptions_url: 'https://api.github.com/users/Thatkookooguy/subscriptions',
        organizations_url: 'https://api.github.com/users/Thatkookooguy/orgs',
        repos_url: 'https://api.github.com/users/Thatkookooguy/repos',
        events_url: 'https://api.github.com/users/Thatkookooguy/events{/privacy}',
        received_events_url: 'https://api.github.com/users/Thatkookooguy/received_events',
        type: 'User',
        site_admin: false
      },
      body: '',
      created_at: '2019-12-12T13:48:34Z',
      updated_at: '2019-12-12T13:48:34Z',
      closed_at: null,
      merged_at: null,
      merge_commit_sha: null,
      assignee: null,
      assignees: [],
      requested_reviewers: [],
      requested_teams: [],
      labels: [],
      milestone: null,
      commits_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/pulls/1/commits',
      review_comments_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/pulls/1/comments',
      review_comment_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/pulls/comments{/number}',
      comments_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/issues/1/comments',
      statuses_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/statuses/b937b9965d0d8fd3f7ecc2cefbc8fba8931a4622',
      head: {
        label: 'Thatkookooguy:Thatkookooguy-patch-1',
        ref: 'Thatkookooguy-patch-1',
        sha: 'b937b9965d0d8fd3f7ecc2cefbc8fba8931a4622',
        user: {
          login: 'Thatkookooguy',
          id: 10427304,
          node_id: 'MDQ6VXNlcjEwNDI3MzA0',
          avatar_url: 'https://avatars3.githubusercontent.com/u/10427304?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/Thatkookooguy',
          html_url: 'https://github.com/Thatkookooguy',
          followers_url: 'https://api.github.com/users/Thatkookooguy/followers',
          following_url: 'https://api.github.com/users/Thatkookooguy/following{/other_user}',
          gists_url: 'https://api.github.com/users/Thatkookooguy/gists{/gist_id}',
          starred_url: 'https://api.github.com/users/Thatkookooguy/starred{/owner}{/repo}',
          subscriptions_url: 'https://api.github.com/users/Thatkookooguy/subscriptions',
          organizations_url: 'https://api.github.com/users/Thatkookooguy/orgs',
          repos_url: 'https://api.github.com/users/Thatkookooguy/repos',
          events_url: 'https://api.github.com/users/Thatkookooguy/events{/privacy}',
          received_events_url: 'https://api.github.com/users/Thatkookooguy/received_events',
          type: 'User',
          site_admin: false
        },
        repo: {
          id: 227616181,
          node_id: 'MDEwOlJlcG9zaXRvcnkyMjc2MTYxODE=',
          name: 'test-new-achievibit-events',
          full_name: 'Thatkookooguy/test-new-achievibit-events',
          private: false,
          owner: {
            login: 'Thatkookooguy',
            id: 10427304,
            node_id: 'MDQ6VXNlcjEwNDI3MzA0',
            avatar_url: 'https://avatars3.githubusercontent.com/u/10427304?v=4',
            gravatar_id: '',
            url: 'https://api.github.com/users/Thatkookooguy',
            html_url: 'https://github.com/Thatkookooguy',
            followers_url: 'https://api.github.com/users/Thatkookooguy/followers',
            following_url: 'https://api.github.com/users/Thatkookooguy/following{/other_user}',
            gists_url: 'https://api.github.com/users/Thatkookooguy/gists{/gist_id}',
            starred_url: 'https://api.github.com/users/Thatkookooguy/starred{/owner}{/repo}',
            subscriptions_url: 'https://api.github.com/users/Thatkookooguy/subscriptions',
            organizations_url: 'https://api.github.com/users/Thatkookooguy/orgs',
            repos_url: 'https://api.github.com/users/Thatkookooguy/repos',
            events_url: 'https://api.github.com/users/Thatkookooguy/events{/privacy}',
            received_events_url: 'https://api.github.com/users/Thatkookooguy/received_events',
            type: 'User',
            site_admin: false
          },
          html_url: 'https://github.com/Thatkookooguy/test-new-achievibit-events',
          description: null,
          fork: false,
          url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events',
          forks_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/forks',
          keys_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/keys{/key_id}',
          collaborators_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/collaborators{/collaborator}',
          teams_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/teams',
          hooks_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/hooks',
          issue_events_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/issues/events{/number}',
          events_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/events',
          assignees_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/assignees{/user}',
          branches_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/branches{/branch}',
          tags_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/tags',
          blobs_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/git/blobs{/sha}',
          git_tags_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/git/tags{/sha}',
          git_refs_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/git/refs{/sha}',
          trees_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/git/trees{/sha}',
          statuses_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/statuses/{sha}',
          languages_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/languages',
          stargazers_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/stargazers',
          contributors_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/contributors',
          subscribers_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/subscribers',
          subscription_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/subscription',
          commits_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/commits{/sha}',
          git_commits_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/git/commits{/sha}',
          comments_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/comments{/number}',
          issue_comment_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/issues/comments{/number}',
          contents_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/contents/{+path}',
          compare_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/compare/{base}...{head}',
          merges_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/merges',
          archive_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/{archive_format}{/ref}',
          downloads_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/downloads',
          issues_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/issues{/number}',
          pulls_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/pulls{/number}',
          milestones_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/milestones{/number}',
          notifications_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/notifications{?since,all,participating}',
          labels_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/labels{/name}',
          releases_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/releases{/id}',
          deployments_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/deployments',
          created_at: '2019-12-12T13:41:55Z',
          updated_at: '2019-12-12T13:41:59Z',
          pushed_at: '2019-12-12T13:48:29Z',
          git_url: 'git://github.com/Thatkookooguy/test-new-achievibit-events.git',
          ssh_url: 'git@github.com:Thatkookooguy/test-new-achievibit-events.git',
          clone_url: 'https://github.com/Thatkookooguy/test-new-achievibit-events.git',
          svn_url: 'https://github.com/Thatkookooguy/test-new-achievibit-events',
          homepage: null,
          size: 0,
          stargazers_count: 0,
          watchers_count: 0,
          language: null,
          has_issues: true,
          has_projects: true,
          has_downloads: true,
          has_wiki: true,
          has_pages: false,
          forks_count: 0,
          mirror_url: null,
          archived: false,
          disabled: false,
          open_issues_count: 1,
          license: null,
          forks: 0,
          open_issues: 1,
          watchers: 0,
          default_branch: 'master'
        }
      },
      base: {
        label: 'Thatkookooguy:master',
        ref: 'master',
        sha: '1373147968cd5101404f624ef517c12b5c48be24',
        user: {
          login: 'Thatkookooguy',
          id: 10427304,
          node_id: 'MDQ6VXNlcjEwNDI3MzA0',
          avatar_url: 'https://avatars3.githubusercontent.com/u/10427304?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/Thatkookooguy',
          html_url: 'https://github.com/Thatkookooguy',
          followers_url: 'https://api.github.com/users/Thatkookooguy/followers',
          following_url: 'https://api.github.com/users/Thatkookooguy/following{/other_user}',
          gists_url: 'https://api.github.com/users/Thatkookooguy/gists{/gist_id}',
          starred_url: 'https://api.github.com/users/Thatkookooguy/starred{/owner}{/repo}',
          subscriptions_url: 'https://api.github.com/users/Thatkookooguy/subscriptions',
          organizations_url: 'https://api.github.com/users/Thatkookooguy/orgs',
          repos_url: 'https://api.github.com/users/Thatkookooguy/repos',
          events_url: 'https://api.github.com/users/Thatkookooguy/events{/privacy}',
          received_events_url: 'https://api.github.com/users/Thatkookooguy/received_events',
          type: 'User',
          site_admin: false
        },
        repo: {
          id: 227616181,
          node_id: 'MDEwOlJlcG9zaXRvcnkyMjc2MTYxODE=',
          name: 'test-new-achievibit-events',
          full_name: 'Thatkookooguy/test-new-achievibit-events',
          private: false,
          owner: {
            login: 'Thatkookooguy',
            id: 10427304,
            node_id: 'MDQ6VXNlcjEwNDI3MzA0',
            avatar_url: 'https://avatars3.githubusercontent.com/u/10427304?v=4',
            gravatar_id: '',
            url: 'https://api.github.com/users/Thatkookooguy',
            html_url: 'https://github.com/Thatkookooguy',
            followers_url: 'https://api.github.com/users/Thatkookooguy/followers',
            following_url: 'https://api.github.com/users/Thatkookooguy/following{/other_user}',
            gists_url: 'https://api.github.com/users/Thatkookooguy/gists{/gist_id}',
            starred_url: 'https://api.github.com/users/Thatkookooguy/starred{/owner}{/repo}',
            subscriptions_url: 'https://api.github.com/users/Thatkookooguy/subscriptions',
            organizations_url: 'https://api.github.com/users/Thatkookooguy/orgs',
            repos_url: 'https://api.github.com/users/Thatkookooguy/repos',
            events_url: 'https://api.github.com/users/Thatkookooguy/events{/privacy}',
            received_events_url: 'https://api.github.com/users/Thatkookooguy/received_events',
            type: 'User',
            site_admin: false
          },
          html_url: 'https://github.com/Thatkookooguy/test-new-achievibit-events',
          description: null,
          fork: false,
          url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events',
          forks_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/forks',
          keys_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/keys{/key_id}',
          collaborators_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/collaborators{/collaborator}',
          teams_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/teams',
          hooks_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/hooks',
          issue_events_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/issues/events{/number}',
          events_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/events',
          assignees_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/assignees{/user}',
          branches_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/branches{/branch}',
          tags_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/tags',
          blobs_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/git/blobs{/sha}',
          git_tags_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/git/tags{/sha}',
          git_refs_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/git/refs{/sha}',
          trees_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/git/trees{/sha}',
          statuses_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/statuses/{sha}',
          languages_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/languages',
          stargazers_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/stargazers',
          contributors_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/contributors',
          subscribers_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/subscribers',
          subscription_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/subscription',
          commits_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/commits{/sha}',
          git_commits_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/git/commits{/sha}',
          comments_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/comments{/number}',
          issue_comment_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/issues/comments{/number}',
          contents_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/contents/{+path}',
          compare_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/compare/{base}...{head}',
          merges_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/merges',
          archive_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/{archive_format}{/ref}',
          downloads_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/downloads',
          issues_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/issues{/number}',
          pulls_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/pulls{/number}',
          milestones_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/milestones{/number}',
          notifications_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/notifications{?since,all,participating}',
          labels_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/labels{/name}',
          releases_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/releases{/id}',
          deployments_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/deployments',
          created_at: '2019-12-12T13:41:55Z',
          updated_at: '2019-12-12T13:41:59Z',
          pushed_at: '2019-12-12T13:48:29Z',
          git_url: 'git://github.com/Thatkookooguy/test-new-achievibit-events.git',
          ssh_url: 'git@github.com:Thatkookooguy/test-new-achievibit-events.git',
          clone_url: 'https://github.com/Thatkookooguy/test-new-achievibit-events.git',
          svn_url: 'https://github.com/Thatkookooguy/test-new-achievibit-events',
          homepage: null,
          size: 0,
          stargazers_count: 0,
          watchers_count: 0,
          language: null,
          has_issues: true,
          has_projects: true,
          has_downloads: true,
          has_wiki: true,
          has_pages: false,
          forks_count: 0,
          mirror_url: null,
          archived: false,
          disabled: false,
          open_issues_count: 1,
          license: null,
          forks: 0,
          open_issues: 1,
          watchers: 0,
          default_branch: 'master'
        }
      },
      _links: {
        self: {
          href: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/pulls/1'
        },
        html: {
          href: 'https://github.com/Thatkookooguy/test-new-achievibit-events/pull/1'
        },
        issue: {
          href: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/issues/1'
        },
        comments: {
          href: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/issues/1/comments'
        },
        review_comments: {
          href: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/pulls/1/comments'
        },
        review_comment: {
          href: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/pulls/comments{/number}'
        },
        commits: {
          href: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/pulls/1/commits'
        },
        statuses: {
          href: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/statuses/b937b9965d0d8fd3f7ecc2cefbc8fba8931a4622'
        }
      },
      author_association: 'OWNER',
      draft: false,
      merged: false,
      mergeable: null,
      rebaseable: null,
      mergeable_state: 'unknown',
      merged_by: null,
      comments: 0,
      review_comments: 0,
      maintainer_can_modify: false,
      commits: 1,
      additions: 1,
      deletions: 0,
      changed_files: 1
    },
    repository: {
      id: 227616181,
      node_id: 'MDEwOlJlcG9zaXRvcnkyMjc2MTYxODE=',
      name: 'test-new-achievibit-events',
      full_name: 'Thatkookooguy/test-new-achievibit-events',
      private: false,
      owner: {
        login: 'Thatkookooguy',
        id: 10427304,
        node_id: 'MDQ6VXNlcjEwNDI3MzA0',
        avatar_url: 'https://avatars3.githubusercontent.com/u/10427304?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/Thatkookooguy',
        html_url: 'https://github.com/Thatkookooguy',
        followers_url: 'https://api.github.com/users/Thatkookooguy/followers',
        following_url: 'https://api.github.com/users/Thatkookooguy/following{/other_user}',
        gists_url: 'https://api.github.com/users/Thatkookooguy/gists{/gist_id}',
        starred_url: 'https://api.github.com/users/Thatkookooguy/starred{/owner}{/repo}',
        subscriptions_url: 'https://api.github.com/users/Thatkookooguy/subscriptions',
        organizations_url: 'https://api.github.com/users/Thatkookooguy/orgs',
        repos_url: 'https://api.github.com/users/Thatkookooguy/repos',
        events_url: 'https://api.github.com/users/Thatkookooguy/events{/privacy}',
        received_events_url: 'https://api.github.com/users/Thatkookooguy/received_events',
        type: 'User',
        site_admin: false
      },
      html_url: 'https://github.com/Thatkookooguy/test-new-achievibit-events',
      description: null,
      fork: false,
      url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events',
      forks_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/forks',
      keys_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/keys{/key_id}',
      collaborators_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/collaborators{/collaborator}',
      teams_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/teams',
      hooks_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/hooks',
      issue_events_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/issues/events{/number}',
      events_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/events',
      assignees_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/assignees{/user}',
      branches_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/branches{/branch}',
      tags_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/tags',
      blobs_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/git/blobs{/sha}',
      git_tags_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/git/tags{/sha}',
      git_refs_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/git/refs{/sha}',
      trees_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/git/trees{/sha}',
      statuses_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/statuses/{sha}',
      languages_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/languages',
      stargazers_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/stargazers',
      contributors_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/contributors',
      subscribers_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/subscribers',
      subscription_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/subscription',
      commits_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/commits{/sha}',
      git_commits_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/git/commits{/sha}',
      comments_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/comments{/number}',
      issue_comment_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/issues/comments{/number}',
      contents_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/contents/{+path}',
      compare_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/compare/{base}...{head}',
      merges_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/merges',
      archive_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/{archive_format}{/ref}',
      downloads_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/downloads',
      issues_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/issues{/number}',
      pulls_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/pulls{/number}',
      milestones_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/milestones{/number}',
      notifications_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/notifications{?since,all,participating}',
      labels_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/labels{/name}',
      releases_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/releases{/id}',
      deployments_url: 'https://api.github.com/repos/Thatkookooguy/test-new-achievibit-events/deployments',
      created_at: '2019-12-12T13:41:55Z',
      updated_at: '2019-12-12T13:41:59Z',
      pushed_at: '2019-12-12T13:48:29Z',
      git_url: 'git://github.com/Thatkookooguy/test-new-achievibit-events.git',
      ssh_url: 'git@github.com:Thatkookooguy/test-new-achievibit-events.git',
      clone_url: 'https://github.com/Thatkookooguy/test-new-achievibit-events.git',
      svn_url: 'https://github.com/Thatkookooguy/test-new-achievibit-events',
      homepage: null,
      size: 0,
      stargazers_count: 0,
      watchers_count: 0,
      language: null,
      has_issues: true,
      has_projects: true,
      has_downloads: true,
      has_wiki: true,
      has_pages: false,
      forks_count: 0,
      mirror_url: null,
      archived: false,
      disabled: false,
      open_issues_count: 1,
      license: null,
      forks: 0,
      open_issues: 1,
      watchers: 0,
      default_branch: 'master'
    },
    sender: {
      login: 'Thatkookooguy',
      id: 10427304,
      node_id: 'MDQ6VXNlcjEwNDI3MzA0',
      avatar_url: 'https://avatars3.githubusercontent.com/u/10427304?v=4',
      gravatar_id: '',
      url: 'https://api.github.com/users/Thatkookooguy',
      html_url: 'https://github.com/Thatkookooguy',
      followers_url: 'https://api.github.com/users/Thatkookooguy/followers',
      following_url: 'https://api.github.com/users/Thatkookooguy/following{/other_user}',
      gists_url: 'https://api.github.com/users/Thatkookooguy/gists{/gist_id}',
      starred_url: 'https://api.github.com/users/Thatkookooguy/starred{/owner}{/repo}',
      subscriptions_url: 'https://api.github.com/users/Thatkookooguy/subscriptions',
      organizations_url: 'https://api.github.com/users/Thatkookooguy/orgs',
      repos_url: 'https://api.github.com/users/Thatkookooguy/repos',
      events_url: 'https://api.github.com/users/Thatkookooguy/events{/privacy}',
      received_events_url: 'https://api.github.com/users/Thatkookooguy/received_events',
      type: 'User',
      site_admin: false
    }
  }
};
