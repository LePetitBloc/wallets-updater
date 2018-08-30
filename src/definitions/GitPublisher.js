const git = require('simple-git/promise');
const util = require("util");
const exec = util.promisify(require("child_process").exec);

class GitPublisher {
  constructor(workspacePath, token) {
    this.workspacePath = workspacePath;
    this.token = token;
  }

  async setCredentials() {
    const { stdout, stderr } = await exec(`eval "$(ssh-agent -s)" && echo -e '${this.token}' ssh-add -`);

    console.log(stdout);
    console.log(stderr);
  }

  async commit(message) {
     const output = await git(this.workspacePath)
       .add(['wallets.json','package.json.'])
       .commit(message);
     console.log(output);
  }

  async tag(tag, message) {
    const output =  await git(this.workspacePath)
      .addAnnotatedTag(tag,message);
    console.log(output);
  }

  async push() {
    const output =  await git(this.workspacePath)
      .push('origin','HEAD',{
        '--follow-tags': null
      });
    console.log(output);
  }


  async publish(commitMessage, versionTag) {
    await this.setCredentials();
    await this.commit(commitMessage);
    await this.tag(versionTag, commitMessage);
    await this.push()

  }

}

module.exports = GitPublisher;
