const util = require("util");
const exists = util.promisify(require('fs').exists);
const git = require('simple-git/promise');
module.exports = async (workspacePath, remoteUri) => {
    const folderExist = await exists(workspacePath);
    if (folderExist) {
      const pullSummary = await git(workspacePath).pull('origin', 'master');
      console.log(pullSummary);
    } else {
      await git().clone(remoteUri, workspacePath);
      console.log('Cloned the repository')
    }
};
