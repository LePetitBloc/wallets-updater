require('dotenv').config();
const Checker = require('./src/definitions/Checker');
const git = require('simple-git/promise');
const workspacePath = './workspace';

console.log(` --wallets updater started at ${new Date()} --`);

git().clone(process.env.REMOTE_REPOSITORY,workspacePath).then(r => {
  console.log(`Cloned repository into ${workspacePath}`);
}).catch(e => {
  console.error('Error while cloning the repo');
});

const wallets = require(workspacePath + '/wallets.json');
new Checker('Dash', wallets.Dash).check().then(r => {
  console.log(r);
});

