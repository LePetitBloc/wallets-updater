class Update {
  constructor(walletIdentifier, from, to) {
    this.walletIdentifier = walletIdentifier;
    this.from = from;
    this.to = to;
  }

  toString() {
    return `updated ${this.walletIdentifier} from ${this.from.toString()} to ${this.to.toString()}`;
  }
}

module.exports = Update;
