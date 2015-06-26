'use strict';

var timekit = require('../src/timekit.js');

var fixtures = {
  app:            'demo',
  apiBaseUrl:     'http://api-localhost.timekit.io/',
  inputTimestampFormat: 'Y-m-d H:i',
  userEmail:      'timebirdcph@gmail.com',
  userApiToken:   'password'
}

/**
 * Intilialise the library
 */
describe('Library initialisation', function() {

  it('should be able initialize the library', function() {

    expect(typeof timekit).toEqual('object');
    expect(typeof timekit.auth).toEqual('function');

  });

  it('should be configurable, set app', function() {

    timekit.configure({ app: fixtures.app });

    var newConfig = timekit.getConfig();
    expect(newConfig.app).toEqual(fixtures.app);

  });

  it('should be configurable, set input timestamp format', function() {

    timekit.configure({ inputTimestampFormat: fixtures.inputTimestampFormat });

    var newConfig = timekit.getConfig();
    expect(newConfig.inputTimestampFormat).toEqual(fixtures.inputTimestampFormat);

  });

  it('should be able to set user manually', function() {

    timekit.setUser(fixtures.userEmail, fixtures.userApiToken);

    var newUser = timekit.getUser();
    expect(newUser.email).toEqual(fixtures.userEmail);
    expect(newUser.apiToken).toEqual(fixtures.userApiToken);

  });

});
