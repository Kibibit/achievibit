const gitlog = require('gitlog').default;
const { join } = require('path');
const githubUsername = require('github-username');
const shell = require('shelljs');
const { forEach, chain } = require('lodash');
const { readJson } = require('fs-extra');


(async () => {
  const allContributorsConfig = await readJson(join(__dirname, '..', '/.all-contributorsrc'));
  const data = gitlog({
    repo: join(__dirname, '..'),
    fields: ["authorName", "authorEmail", "authorDate"]
  });

  let result = {};

  for (const commit of data) {
    const isCode = commit.files.find((item) => item.startsWith('server/src') || item.startsWith('client/src'));
    const isInfra = commit.files.find((item) => item.startsWith('.github/') || item.startsWith('tools/'));
    const isTests = commit.files.find((item) => item.endsWith('.spec.ts'));
    let types = [];
    if (isCode) { types.push('code'); }
    if (isInfra) { types.push('infra'); }
    if (isTests) { types.push('test'); }

    if (!result[commit.authorEmail]) {
      const githubLogin = await githubUsername(commit.authorEmail);
      result[commit.authorEmail] = {
        githubLogin,
        types
      };
    } else {
      result[commit.authorEmail].types = result[commit.authorEmail].types.concat(types);
    }
  }

  forEach(result, (person, email) => {
    const existing = chain(allContributorsConfig.contributors)
      .find((item) => item.login === person.githubLogin)
      .get('contributions', [])
      .value();
    const types = chain(person.types.concat(existing)).uniq().sortBy().value();
    const command = `npm run contributors:add ${ person.githubLogin } ${ types.join(',') }`;
    console.log(command);
    shell.exec(command, { cwd: __dirname });
  })
})();