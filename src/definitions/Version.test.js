const Version = require('./Version');
const testString = 'v1.2.3.4';
test('parse version string', () => {
  expect(Version.fromVersionString('v1.2.3.4')).toEqual({
    prefix:'v',
    major: 1,
    minor: 2,
    patch : 3,
    fourth: 4
  });
});
