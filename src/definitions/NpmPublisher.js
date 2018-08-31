const util = require('util');
const copy = util.promisify(require('fs').copyFile);
const exec = util.promisify(require("child_process").exec);

class NpmPublisher {
  constructor(workspacePath, configFilePath) {
    this.workspacePath = workspacePath;
    this.configFilePath = configFilePath;
  }

  async setCredentials()  {
    await copy(this.configFilePath, `${this.workspacePath}/.npmrc`);
  }

  static async checkAuthentication() {
    try {
      await exec("npm whoami");
    } catch (e) {
      throw new Error("Something went wrong authenticating you on npm - Check your NPM_TOKEN validity");
    }
  }

  async publish() {
    await this.setCredentials();
    await NpmPublisher.checkAuthentication();
    const { stdout } = await exec("npm publish");
    console.log(stdout);
  }

}

module.exports = NpmPublisher;
