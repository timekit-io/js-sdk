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
  beforeEach(function(){
    jasmine.Ajax.install();
  });

  afterEach(function () {
    jasmine.Ajax.uninstall();
  });

  it('should be able load via CommonjS2', function(done) {
    var timekit = require('../dist/timekit.js');

    expect(typeof timekit).toEqual('object');
    expect(typeof timekit.auth).toEqual('function');

    timekit.configure({
      app: fixtures.app,
      apiBaseUrl: fixtures.apiBaseUrl
    });

    var response, request;

    timekit.auth(fixtures.userEmail, fixtures.userPassword)
    .then(function(res) {
      response = res;
    });

    setTimeout(function () {
      request = jasmine.Ajax.requests.mostRecent();

      request.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{ "data": { "first_name": "Dr. Emmett", "last_name": "Brown", "name": "Dr. Emmett Brown", "email": "doc.brown@timekit.io", "img": "http:\/\/www.gravatar.com\/avatar\/35b00087ea20066e5da95f8359183f04", "activated": true, "timezone": "America\/Los_Angeles", "token": "TWXVID51gpqKcLVMQauomHqIrw92acw8", "last_sync": null, "api_token": "nvHfRSlhvsnlg4rS7Wt28Ty47qdgegwSu3YK7hPW" } }',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setTimeout(function () {
        expect(response.data.data.email).toBeDefined();
        expect(typeof response.data.data.email).toBe('string');
        expect(response.data.data.api_token).toBeDefined();
        expect(typeof response.data.data.api_token).toBe('string');
        done();
      }, 0);
    }, 0);

  });

  it('should be able load via AMD (Require.js)', function(done) {

    require(['../dist/timekit.js'], function (timekit) {

      expect(typeof timekit).toEqual('object');
      expect(typeof timekit.auth).toEqual('function');

      timekit.configure({
        app: fixtures.app,
        apiBaseUrl: fixtures.apiBaseUrl
      });

      var request, response;

      timekit.auth(fixtures.userEmail, fixtures.userPassword)
      .then(function(res) {
        response = res;
      });

      setTimeout(function () {
        request = jasmine.Ajax.requests.mostRecent();

        request.respondWith({
          status: 200,
          statusText: 'OK',
          responseText: '{ "data": { "first_name": "Dr. Emmett", "last_name": "Brown", "name": "Dr. Emmett Brown", "email": "doc.brown@timekit.io", "img": "http:\/\/www.gravatar.com\/avatar\/35b00087ea20066e5da95f8359183f04", "activated": true, "timezone": "America\/Los_Angeles", "token": "TWXVID51gpqKcLVMQauomHqIrw92acw8", "last_sync": null, "api_token": "nvHfRSlhvsnlg4rS7Wt28Ty47qdgegwSu3YK7hPW" } }',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        setTimeout(function () {
          expect(response.data.data.email).toBeDefined();
          expect(typeof response.data.data.email).toBe('string');
          expect(response.data.data.api_token).toBeDefined();
          expect(typeof response.data.data.api_token).toBe('string');
          done();
        }, 0);
      }, 0);

    });

  });

});
