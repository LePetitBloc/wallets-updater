const util = require('util');
const writeFile = util.promisify(require('fs').writeFile);
const Version = require('./Version');

class Updater {
  constructor(workspacePath) {
     this.workspacePath =workspacePath;
  }

  async update(updates) {
    const updateSummary = await this.updateWallets(updates);
    await this.updateVersionNumber();
    return updateSummary;
  }

  async updateVersionNumber() {
    const filePath =`${this.workspacePath}/package.json`;
    const manifest = require(filePath);
    const currentVersion = Version.fromVersionString(manifest.version);
    currentVersion.patch += 1;

    manifest.version = currentVersion.toString();
    return writeFile(filePath, JSON.stringify(manifest, null, '  '));
  }

  async updateWallets(updates) {
    const filePath = `${this.workspacePath}/wallets.json`;
    const wallets = require(filePath);
    let updateSummary = '';

    updates.forEach(update => {
      if (update) {
        wallets[update.walletIdentifier].tag = update.to.toString();
        updateSummary += `${update.toString()} \n`;
      }
    });
    await writeFile(filePath, JSON.stringify(wallets, null, '  '));
    return updateSummary;
  }
}

module.exports = Updater;
