#!/usr/bin/env node

const {
  exec
} = require('child_process');

const travisPullRequest = process.env.TRAVIS_PULL_REQUEST;
const nowToken = process.env.NOW_TOKEN;

if (!travisPullRequest ||
  !nowToken) {
  console.error('required environment variables are not set');
  throw new Error('required environment variables are not set');
}

exec(`now alias --token=${nowToken} $(now ./test-results --no-clipboard --token=${nowToken} --public) achievibit-pr-${ travisPullRequest }`,
  async (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      // node couldn't execute the command
      return;
    }

    const Octokit = require("@octokit/rest");
    const auth = process.env.GH_TOKEN;
    const octokit = new Octokit({ auth });

    const prSlug = process.env.TRAVIS_PULL_REQUEST_SLUG;

    const splitted = prSlug.split('\/');

    const comment = {
      repo: splitted[1],
      owner: splitted[0],
      issue_number: travisPullRequest,
      body: 'very nice, sir!'
    };

    const response = await octokit.issues.createComment(comment);

    // the *entire* stdout and stderr (buffered)
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
    console.log(response);
  });
