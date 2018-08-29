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

  static arrayFromTagList(tagList) {
    const versions = [];
    let version;
    versionNumberRegexp.lastIndex = 0;
    while ((version = versionNumberRegexp.exec(tagList))) {
      versions.push(new Version(version));
    }
    return versions;
  }

  static sorter(a, b) {
      if (
        a.major > b.major ||
        (a.major >= b.major && a.minor > b.minor) ||
        (a.major >= b.major && a.minor >= b.minor && a.patch > b.patch) ||
        (a.major >= b.major && a.minor >= b.minor && a.patch >= b.patch && a.fourth > b.fourth)
      ) {
        return 1;
      } else {
        return -1;
      }
  }

  superiorTo() {
    return version => {
      if (version.major === this.major) {
        if (version.minor > this.minor) {
          return 1;
        } else if (version.minor === this.minor) {
          if (version.patch > this.patch) {
            return 1;
          } else if (version.patch === this.patch) {
            if (version.fourth > this.fourth) {
              return 1;
            }
          }
        }
      }
      return 0;
    };
  }

  toString() {
    return `${this.prefix}${this.major}.${this.minor}${this.patch !== null ? `.${this.patch}` : ""}`+
      `${this.fourth !== null ? `.${this.fourth}` : ""}`
  }
}

module.exports = Version;
