const sgf = require('staged-git-files');

const myArgs = process.argv.slice(2);
const checkPart = myArgs[0];

sgf((err, changedFiles) => {
  if (err) {
    throw err;
  }

  const changedFilenames = changedFiles.map((item) => item.filename);
  const isServerChanged = changedFilenames
    .find((filename) => filename.startsWith('server/'));
  const isClientChanged = changedFilenames
    .find((filename) => filename.startsWith('client/'));
  const isAchChanged = changedFilenames
    .find((filename) => filename.startsWith('achievements/'));
  const isToolsChanged = changedFilenames
    .find((filename) => filename.startsWith('tools/'));

  if (checkPart === 'server' && isServerChanged) {
    process.exit(0);
  }

  if (checkPart === 'client' && isClientChanged) {
    process.exit(0);
  }

  if (checkPart === 'ach' && isAchChanged) {
    process.exit(0);
  }

  if (checkPart === 'tools' && isToolsChanged) {
    process.exit(0);
  }

  process.exit(1);
});