require('dotenv').config();

console.log(` --wallets updater started at ${new Date()} --`);

if(!process.env.REMOTE_REPOSITORY) {
  throw new Error('missing environnement variable : REMOTE_REPOSITORY');
}
if(!process.env.WORKSPACE_DIR) {
  throw new Error('missing environnement variable : WORKSPACE_DIR');
}



(async function() {
  try {
    await require('./src/lib/loadRepository')(process.env.WORKSPACE_DIR, process.env.REMOTE_REPOSITORY);
    const Checker = require('./src/definitions/Checker');
    const Updater = require('./src/definitions/Updater.js');
    const wallets = require(process.env.WORKSPACE_DIR + '/wallets.json');

    let updates = await Checker.checkAll(wallets);
    updates = updates.filter(o => o !== null);

    if(updates.length > 0) {
      await Updater.update(updates);
    }

  } catch (e) {
    console.error(e);
  }
})();
