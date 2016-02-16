'use strict';

var utils = require('./helpers/utils');

var fixtures = {
  app:            'demo',
  apiBaseUrl:     'http://api-localhost.timekit.io/',
  userEmail:      'timebirdcph@gmail.com',
  userPassword:   'password'
}

/**
 * Load the library using different UMD module loaders
 */
describe('Module loaders', function() {

  beforeEach(function(){
    jasmine.Ajax.install();
  });

  afterEach(function () {
    jasmine.Ajax.uninstall();
  });

  it('should be able to load via CommonJS2', function(done) {
    var timekitCommonJS = require('../dist/timekit-sdk.js');

    expect(typeof timekitCommonJS).toEqual('object');
    expect(typeof timekitCommonJS.auth).toEqual('function');

    timekitCommonJS.configure({
      app: fixtures.app,
      apiBaseUrl: fixtures.apiBaseUrl
    });

    var response, request;

    timekitCommonJS.auth({
      email: fixtures.userEmail,
      password: fixtures.userPassword
    }).then(function(res) {
      response = res;
    });

    utils.tick(function () {
      request = jasmine.Ajax.requests.mostRecent();

      request.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{ "data": { "first_name": "Dr. Emmett", "last_name": "Brown", "name": "Dr. Emmett Brown", "email": "doc.brown@timekit.io", "img": "http:\/\/www.gravatar.com\/avatar\/35b00087ea20066e5da95f8359183f04", "activated": true, "timezone": "America\/Los_Angeles", "id": "TWXVID51gpqKcLVMQauomHqIrw92acw8", "last_sync": null, "api_token": "nvHfRSlhvsnlg4rS7Wt28Ty47qdgegwSu3YK7hPW" } }',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      utils.tick(function () {
        expect(response.data.email).toBeDefined();
        expect(typeof response.data.email).toBe('string');
        expect(response.data.api_token).toBeDefined();
        expect(typeof response.data.api_token).toBe('string');
        done();
      });
    });

  });

  it('should be able to load via AMD (Require.js)', function(done) {

    require(['../dist/timekit-sdk.js'], function (timekitRequireJS) {

      expect(typeof timekitRequireJS).toEqual('object');
      expect(typeof timekitRequireJS.auth).toEqual('function');

      timekitRequireJS.configure({
        app: fixtures.app,
        apiBaseUrl: fixtures.apiBaseUrl
      });

      var request, response;

      timekitRequireJS.auth({
        email: fixtures.userEmail,
        password: fixtures.userPassword
      }).then(function(res) {
        response = res;
      });

      utils.tick(function () {
        request = jasmine.Ajax.requests.mostRecent();

        request.respondWith({
          status: 200,
          statusText: 'OK',
          responseText: '{ "data": { "first_name": "Dr. Emmett", "last_name": "Brown", "name": "Dr. Emmett Brown", "email": "doc.brown@timekit.io", "img": "http:\/\/www.gravatar.com\/avatar\/35b00087ea20066e5da95f8359183f04", "activated": true, "timezone": "America\/Los_Angeles", "id": "TWXVID51gpqKcLVMQauomHqIrw92acw8", "last_sync": null, "api_token": "nvHfRSlhvsnlg4rS7Wt28Ty47qdgegwSu3YK7hPW" } }',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        utils.tick(function () {
          expect(response.data.email).toBeDefined();
          expect(typeof response.data.email).toBe('string');
          expect(response.data.api_token).toBeDefined();
          expect(typeof response.data.api_token).toBe('string');
          done();
        });
      });

    });

  });

});
