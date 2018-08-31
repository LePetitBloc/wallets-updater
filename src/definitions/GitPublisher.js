const git = require('simple-git/promise');
const util = require("util");
const exec = util.promisify(require("child_process").exec);

class GitPublisher {
  constructor(workspacePath, token) {
    this.workspacePath = workspacePath;
    this.token = token;
    this.git = git(this.workspacePath)
      .outputHandler((command, stdout, stderr) => {
        stdout.pipe(process.stdout);
        stderr.pipe(process.stderr);
      });
  }

  async setCredentials() {
    console.log('set');
    const {stdout, stderr} =   await exec(`eval "$(ssh-agent -s)" && echo -e '${this.token}' ssh-add -`);
    console.log(stdout, stderr);
  }

  async commit(title, message) {
    await this.git.add(['wallets.json', 'package.json']);
    return await this.git.commit([title, message]);
  }

  async tag(tag, message) {
    return await this.git
      .addAnnotatedTag(tag, message);
  }

  async push() {
    return await this.git
      .push('origin', 'HEAD', {
        '--follow-tags': null
      });
  }


  async publish(commitTitle, commitMessage , versionTag) {
    await this.setCredentials();
    await this.commit(commitTitle, commitMessage);
    await this.tag(versionTag, commitMessage);
    await this.push()
  }

}

module.exports = GitPublisher;
