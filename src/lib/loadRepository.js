const util = require("util");
const exists = util.promisify(require('fs').exists);
const git = require('simple-git/promise');
module.exports = async (workspacePath, remoteUri) => {
    const folderExist = await exists(workspacePath);
    if (folderExist) {
      console.log('Pulling from remote repository');
      const pullSummary = await git(workspacePath).pull('origin', 'master');
      console.log(pullSummary);
    } else {
      console.log('Cloning remote repository');
      await git().clone(remoteUri, workspacePath);
      console.log('Cloned the repository')
    }
};
