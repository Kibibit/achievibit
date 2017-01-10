## achievibit
<img src="https://achievibit.herokuapp.com/images/favicon.png" width="150">
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=102)](https://github.com/ellerbrock/open-source-badge/)
------
github hook system to integrate achievements for repositories

## how to use

achievibit needs to be integrated into each enabled repository via a webhook.

1. Go to your main repository page
2. click on ***Settings***
3. on the sidebar, click on ***Webhooks***
4. click on ***add webhook***
5. paste achievibit's url (`achievibit.herokuapp.com`) into the ***payload url***
6. on ***Which events would you like to trigger this webhook?***, select `Let me select individual events.` and check `Pull request`

**Maybe sometime later we'll also support repo achievements. open an issue if you're interested :-)**

## how to clone your own server

## how to create new achievements


`achievibit` listens to changes in pull requests and logs some things.
`achievibit` notifies achievements only when pull requests are being merged, and passes the logged data.
If a pull request got closed, achievements won't be rewarded (think of it as quitting the game)

here is a general structure of the data collected about a pull request:
```json
{
  "number": 212,
  "title": "[TESTING WEB HOOK] ignore this PR",
  "description": "testing some status changes events in `github`'s **webhooks**.",
  "creator": {
    "username": "Thatkookooguy",
    "url": "<github_user_url>"
    avatar: "<github_avatar_url>"
  },
  "createdOn": "2016-10-02T08:09:33Z",
  "milestone": "01. Create a kickass **code editor** for remote programming",
  "labels": [
    "dependencies",
    "build feature",
    "in progress"
  ],
  "history": {
    "labels": {
      "added": 1,
      "removed": 0
    }
  },
  "reviewers": [
    {
      "username": "ortichon",
      "url": "https://api.github.com/users/ortichon"
    },
    {
      "username": "dunaevsky",
      "url": "https://api.github.com/users/dunaevsky"
    }
  ]
}
```

history saves all the changed data. for **labels**, it's just if they changed or not and how many times.

## USER achievements

even achievements that span over multiple PRs are rewarded when a PR is merged. for example, the achievement for creating more than 10 PR can check the data on the user object
the user object keeps very minimal data about cross PR data. that data is already updated with the newly merged PR.

so, if a user had 5 PR opened and merged while achievibit was collecting data, his data will look like so:

```json
// USER
{
  "username": "thatkookooguy",
  "url": "https://api.github.com/users/Thatkookooguy",
  "mergedPullRequests": 5,
  "abandonedPullRequests": 3,
  "reviewedPullRequests": 2,
  "achievements": [
    "achiev_id",
    "achiev_id2",
  ]
}
```

when the user creates a new PR, and merges is, the achievement function will get the following data:

```javascript
function challenge(pullRequestData, creator, reviewers) {
  console.log(creator.mergedPullRequests); // 6 (since this pull request is already included)
}
```

this way, achievements that only try to look at those numbers, don't even need to go through the pull request data;

some achievements examples:
```javascript
function activeReviewer(pullRequestData, creator, reviewers) {
  _.forEach(reviewers, function(reviewer) {
    if (reviewer.reviewedPullRequests >= 50) {
      reviewer.reward({
        name: 'nitpicker',
        short: 'It\'s not personal, Sonny. It\'s strictly business',
        description: 'you reviewed 50 merged pull requests!',
        avatar: 'url_to_img'
      });
    } else if (reviewer.reviewedPullRequests >= 100) {
      reviewer.reward({
        name: 'niggler',
        short: 'A person who bitches about stupid details (and a way to get away with saying nigger)',
        description: 'you reviewed 100 merged pull requests!',
        avatar: 'url_to_img'
      });
    }
  });
}
```
 s
