'use strict';

var fixtures = {
  app:            'demo',
  apiBaseUrl:     'http://api-localhost.timekit.io/',
  userEmail:      'timebirdcph@gmail.com',
  userPassword:   'password'
}

/**
 * Load the library using different UMD module loaders
 */
describe('Library module loaders', function() {

  it('should be able load via CommonjS2', function(done) {

    var timekit = require('../dist/timekit.js');

    expect(typeof timekit).toEqual('object');
    expect(typeof timekit.auth).toEqual('function');

    timekit.configure({
      app: fixtures.app,
      apiBaseUrl: fixtures.apiBaseUrl
    });

    timekit.auth(fixtures.userEmail, fixtures.userPassword)
    .then(function(response) {
      expect(response.data.data.email).toBeDefined();
      expect(typeof response.data.data.email).toBe('string');
      expect(response.data.data.api_token).toBeDefined();
      expect(typeof response.data.data.api_token).toBe('string');
      done();
    });

  });

  it('should be able load via AMD (Require.js)', function(done) {

    require(['../dist/timekit.js'], function (timekit) {

      expect(typeof timekit).toEqual('object');
      expect(typeof timekit.auth).toEqual('function');

      timekit.configure({
        app: fixtures.app,
        apiBaseUrl: fixtures.apiBaseUrl
      });

      timekit.auth(fixtures.userEmail, fixtures.userPassword)
      .then(function(response) {
        expect(response.data.data.email).toBeDefined();
        expect(typeof response.data.data.email).toBe('string');
        expect(response.data.data.api_token).toBeDefined();
        expect(typeof response.data.data.api_token).toBe('string');
        done();
      });

    });

  });

});
