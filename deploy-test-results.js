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

exec(`now alias --token=${nowToken} $(now ./test-results --static --no-clipboard --token=${nowToken} --public) achievibit-pr-${ travisPullRequest }`,
  (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      // node couldn't execute the command
      return;
    }

    // the *entire* stdout and stderr (buffered)
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
