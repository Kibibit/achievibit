const simpleGit = require('simple-git/promise');
const { chain, trim, map } = require('lodash');
const inquirer = require('inquirer');
const Table = require('cli-table');

const git = simpleGit();
const remoteInfoRegex = /^\[(.*?)\]\s/g;
const MAIN_BRANCHES = [
  'master',
  'main'
];

const chars = {
  'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗'
  , 'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝'
  , 'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼'
  , 'right': '║', 'right-mid': '╢', 'middle': '│'
};

(async () => {
  try {
    await git.fetch(['-p']); // prune? is it necassery?
    const branchSummaryResult = await git.branch(['-vv']);
    const localBranches = branchSummaryResult.branches;
    const localBranchesWithGoneRemotes = chain(localBranches)
      .filter((item) => !MAIN_BRANCHES.includes(item.name))
      .forEach((item) => {
        // console.log('an item appeared!', item);
        const remoteInfo = item.label.match(remoteInfoRegex);

        if (remoteInfo) {
          const parsedRemoteInfo = trim(remoteInfo[0], '[] ');
          const isMerged = parsedRemoteInfo.endsWith(': gone');
          const remoteBranchName = parsedRemoteInfo.replace(': gone', '');

          item.isMerged = isMerged;
          item.remoteName = remoteBranchName;
        }
      })
      .filter((item) => item.isMerged)
      .value();
    const branchNames = chain(localBranchesWithGoneRemotes).map('name').value();

    if (!branchNames.length) {
      console.log('PROJECT IS CLEAN! WELL DONE!');
      process.exit(0);
    }

    // interaction!
    const table = new Table({
      head: ['Branch Name', 'Origin Branch Name', 'Origin Branch Status'],
      chars
    });

    localBranchesWithGoneRemotes.forEach((item) => table.push([item.name, item.remoteName, 'GONE']));

    console.log(`${table.toString()}\n`);

    const ACTION_ANSWERS = {
      PRUNE_ALL: 'prune all gone branches',
      SELECT_BRANCHES: 'Selected Individual branches to delete'
    }

    const answers = await inquirer
      .prompt([
        {
          type: 'list',
          name: 'whatToDo',
          message: 'These branches have been deleted from the origin. What do you want to do with them?',
          choices: chain(ACTION_ANSWERS).values().value()
        }
      ]);

    if (answers.whatToDo === ACTION_ANSWERS.PRUNE_ALL) {
      await moveToAnotherBranchIfNeeded(branchSummaryResult, branchNames);

      const result = await git.deleteLocalBranches(branchNames, true);
      console.log('DONE');
      chain(result.all)
        .map((item) => `${ item.branch }: ${ item.success ? 'DELETED' : 'FAILED' }`)
        .forEach((item) => console.log(item));
      return;
    }

    if (answers.whatToDo === ACTION_ANSWERS.SELECT_BRANCHES) {
      const answers = await inquirer
        .prompt([
          {
            type: 'checkbox',
            message: 'These branches have been deleted from the origin. Do you want to prune them?',
            name: 'pruneBranches',
            choices: branchNames
          }
        ]);

      await moveToAnotherBranchIfNeeded(branchSummaryResult, branchNames);

      const result = await Promise.all(answers.pruneBranches.map((branchName) => git.deleteLocalBranch(branchName, true)));
      console.log('DONE');
      console.log(result);
      chain(result.all)
        .map((item) => `${ item.branch }: ${ item.success ? 'DELETED' : 'FAILED' }`)
        .forEach((item) => console.log(item));
      return;
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();

async function moveToAnotherBranchIfNeeded(branchSummaryResult, branchesToDelete) {
  const suspectedMainBranch = branchSummaryResult.all.find((branchName) => MAIN_BRANCHES.includes(branchName));
  const currentCheckedoutBranch = branchSummaryResult.current;

  // console.log('main branch:', suspectedMainBranch);

  if (branchesToDelete.includes(currentCheckedoutBranch)) {
    console.warn(`trying to delete checkedout branch ${ currentCheckedoutBranch }. moving to ${ suspectedMainBranch }`);
    await git.checkout(suspectedMainBranch);
  }
}