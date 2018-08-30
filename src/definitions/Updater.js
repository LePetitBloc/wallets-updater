const util = require("util");
const writeFile = util.promisify(require("fs").writeFile);
const Version = require('./Version');

class Updater {
  static async update(updates) {
      const updateSummary = await Updater.updateWallets(updates);
      await Updater.updateVersionNumber();
      return updateSummary;
   }

   static async updateVersionNumber() {
     const filePath = process.cwd() + '/' + process.env.WORKSPACE_DIR + '/package.json';
     const manifest = require(filePath);
     const currentVersion = Version.fromVersionString(manifest.version);
     currentVersion.patch += 1;

     manifest.version = currentVersion.toString();
     return writeFile(filePath, JSON.stringify(manifest, null, "  "));
   }


   static async updateWallets(updates) {
     const filePath = process.cwd() + '/' + process.env.WORKSPACE_DIR + '/wallets.json';
     const wallets = require(filePath);
     let updateSummary = "";

     updates.forEach(update => {
       if (update) {
         wallets[update.walletIdentifier].tag = update.to.toString();
         updateSummary += `${update.toString()} \n`;
       }
     });
     await writeFile(filePath, JSON.stringify(wallets, null, "  "));
     return updateSummary;
   }
}

module.exports = Updater;
