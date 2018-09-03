const git = require('simple-git/promise');
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const mkdir = util.promisify(require("fs").mkdir);
const exists = util.promisify(require("fs").exists);

class GitPublisher {
  constructor(workspacePath, remote,  token) {
    this.workspacePath = workspacePath;
    this.token = token;
    this.remote = remote;
    this.git = git;
  }

  async init() {
    await this.setCredentials();

    const workspaceExist = await exists(this.workspacePath);
    if(!workspaceExist) {
      await mkdir(this.workspacePath);
    }

    this.git = git(this.workspacePath)
      .outputHandler((command, stdout, stderr) => {
        stdout.pipe(process.stdout);
        stderr.pipe(process.stderr);
      });

    const workspaceIsRepository = await exists(`${this.workspacePath}/.git`);
    if(workspaceIsRepository) {
      await this.git.pull('origin','master');
    }else {
      await this.git.clone(this.remote,this.workspacePath);
    }
  }

  async setCredentials() {
    console.log('set');
    await exec('eval "$(ssh-agent -s)"');
    const {stdout, stderr} = await exec(`echo '${this.token}' | ssh-add -`);
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
