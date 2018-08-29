const versionNumberRegexp = /([vV])?([0-9]{1,2})\.([0-9]{1,2})(?:\.([0-9]{1,2}))?(?:\.([0-9]{1,2}))?[\n|\s]?/g;
class Version {
  constructor(versionRegexpResult) {
    this.prefix = versionRegexpResult[1] || "";
    this.major = parseInt(versionRegexpResult[2]);
    this.minor = parseInt(versionRegexpResult[3]);
    this.patch = versionRegexpResult[4] ? parseInt(versionRegexpResult[4]) : null;
    this.fourth = versionRegexpResult[5] ? parseInt(versionRegexpResult[5]) : null;
  }

  static fromVersionString(versionString) {
    if (typeof versionString === "string") {
      versionNumberRegexp.lastIndex = 0;
      const regexpResult = versionNumberRegexp.exec(versionString);
      if (regexpResult) {
        return new Version(regexpResult);
      }
    }

    throw new Error("Can't parse version string : syntax error");
  }

  toString() {
    return `${this.prefix}${this.major}.${this.minor}${this.patch !== null ? `.${this.patch}` : ""}`+
      `${this.fourth !== null ? `.${this.fourth}` : ""}`
  }
}

module.exports = Version;
