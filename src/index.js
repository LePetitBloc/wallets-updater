require('dotenv').config();
const Checker = require('./definitions/Checker');
const Updater = require('./definitions/Updater.js');
const GitPublisher = require('./definitions/GitPublisher');
const NpmPublisher = require('./definitions/NpmPublisher');

console.log(`======================== wallets updater started at ${new Date()} ========================`);

const requiredEnvironmentVariables = ['REMOTE_REPOSITORY', 'WORKSPACE_DIR' , 'GITHUB_TOKEN' , 'GITHUB_TOKEN' , 'NPM_TOKEN' ];
for(let key of requiredEnvironmentVariables) {;
  if(!process.env[key]) {
    throw new Error(`Missing environment variable : ${key}`);
  }
}

(async function() {
  try {
    const workspacePath = `${process.cwd()}/${process.env.WORKSPACE_DIR}`;

    const gitPublisher = new GitPublisher(workspacePath, process.env.REMOTE_REPOSITORY, process.env.GITHUB_TOKEN);
    await gitPublisher.init();

    const manifest = require(workspacePath + '/package.json');
    const wallets = require(workspacePath + '/wallets.json');

    console.log("[INFO] Checking wallets for updates...");
    let updates = await Checker.checkAll(wallets);
    updates = updates.filter(o => o !== null);
    console.log("[OK] Checked wallets for updates");

    if (updates.length > 0) {
      const updateSummary = await new Updater(workspacePath).update(updates);

      await gitPublisher.publish('Update wallets.json', updateSummary, manifest.version);

      await new NpmPublisher(workspacePath, `${process.cwd()}/src/assets/.npmrc.dist`).publish();

      console.log("------------SUMMARY------------");
      console.log(updateSummary);
      console.log('---------END OF SUMMARY--------');
    } else {
      console.log('[SUMMARY] wallets are up to date');
    }
    console.log(`======================== wallets finished at ${new Date()} ========================`);
  } catch (e) {
    console.error(e);
  }
})();
