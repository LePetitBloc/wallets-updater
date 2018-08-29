const git = require('simple-git/promise')(process.env.WORKSPACE_DIR);
const Version = require('./Version');
const Update = require('./Update');

class Checker {
  constructor(identifier, wallet) {
    this.identifier = identifier;
    this.wallet = wallet;
    this.repository = wallet.repository;
    this.tag = wallet.tag;
  }

  async check() {
    if(!this.repository) {
      throw new Error('No repository provided - Cannot check for update');
    }
    const tags = await git.listRemote(['--tags',[this.repository]]);
    let versions = Version.arrayFromTagList(tags);
    const currentVersion = this.findCurrentVersion();
    if (currentVersion) {
      versions = versions.filter(currentVersion.superiorTo()).sort(Version.sorter);

      if (versions.length > 0) {
        const targetVersion = versions[versions.length - 1];
        return new Update(this.identifier, currentVersion, targetVersion);
      }
    }
    return null;
  }

  findCurrentVersion() {
    try {
      return Version.fromVersionString(this.tag);
    }catch (e) {
      console.warn(`Can't determined current version for wallet :  ${this.identifier}  missing tag`);
      return null;
    }
  }
}

module.exports = Checker;
