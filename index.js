require('dotenv').config();

console.log(` --wallets updater started at ${new Date()} --`);

if(!process.env.REMOTE_REPOSITORY) {
  throw new Error('missing environnement variable : REMOTE_REPOSITORY');
}
if(!process.env.WORKSPACE_DIR) {
  throw new Error('missing environnement variable : WORKSPACE_DIR');
}

if (!process.env.GITHUB_TOKEN) {
  throw new Error("missing environnement variable : GITHUB_TOKEN - cannot send modifications to server.");
}



(async function() {
  try {
    const workspacePath =  `${process.cwd()}/${process.env.WORKSPACE_DIR}`;
    console.log(workspacePath);
    await require('./src/lib/loadRepository')(workspacePath, process.env.REMOTE_REPOSITORY);
    const Checker = require('./src/definitions/Checker');
    const Updater = require('./src/definitions/Updater.js');
    const GitPublisher = require('./src/definitions/GitPublisher');
    const NpmPublisher = require('./src/definitions/NpmPublisher');
    const manifest = require(workspacePath + '/package.json');
    const wallets = require(workspacePath + '/wallets.json');

    let updates = await Checker.checkAll(wallets);
    updates = updates.filter(o => o !== null);

    if(updates.length > 0) {
     const updateSummary =  await Updater.update(updates);
     console.log(updateSummary);
      await new GitPublisher(workspacePath, process.env.REMOTE_REPOSITORY, process.env.GITHUB_TOKEN )
        .publish('Update wallets.json',updateSummary,manifest.version);

      await new NpmPublisher(workspacePath, `${workspacePath}/src/assets/.npmrc.dist`).publish();
    }
  } catch (e) {
    console.error(e);
  }
})();
