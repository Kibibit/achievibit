/* eslint-disable @typescript-eslint/no-var-requires */
const replace = require('replace-in-file');

const projectNameArgs = process.argv.slice(2);
const projectName = projectNameArgs[projectNameArgs.length - 1];

if (!projectName) {
  throw new Error('must pass a project name');
} else {
  console.log(projectName);
  // return;
}

const readmeFile = {
  files: './README.md',
  from: /kb-server-client-template/g,
  to: projectName,
};

const contributorsFile = {
  files: './.all-contributorsrc',
  from: /kb-server-client-template/g,
  to: projectName,
};

const packageFile = {
  files: './package.json',
  from: /kb-server-client-template/g,
  to: projectName,
};

const packageLockFile = {
  files: './package-lock.json',
  from: /kb-server-client-template/g,
  to: projectName,
};



(async () => {
  try {
    let results = [];
    results.push(await replace(readmeFile));
    results.push(await replace(packageFile));
    results.push(await replace(packageLockFile));
    results.push(await replace(contributorsFile));
    console.log('Replacement results:', results);
  }
  catch (error) {
    console.error('Error occurred:', error);
  }
})();
