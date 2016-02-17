'use strict';

var moment = require('moment');
var timekit = require('../src/timekit.js');
var utils = require('./helpers/utils');

var fixtures = {
  app:            'demo',
  apiBaseUrl:     'http://api-localhost.timekit.io/',
  userEmail:      'doc.brown@timekit.io',
  userInvalidEmail: 'invaliduser@gmail.com',
  userPassword:   'password',
  userApiToken:   'password'
}

/**
 * Call API endpoints that doesnt require auth headers
 */
describe('Authentication', function() {

  beforeEach(function() {
    jasmine.Ajax.install();
    timekit.configure({
      app: fixtures.app,
      apiBaseUrl: fixtures.apiBaseUrl
    });
  });

  afterEach(function () {
    jasmine.Ajax.uninstall();
  });

  it('should be able to authenticate by calling [GET] /auth', function(done) {
    var response, request;

    timekit.auth({
      email: fixtures.userEmail,
      password: fixtures.userPassword
    }).then(function(res) {
      response = res;
    });

    utils.tick(function () {
      request = jasmine.Ajax.requests.mostRecent();

      request.respondWith({
        status: 200,
        responseText: '{ "data": { "first_name": "Dr. Emmett", "last_name": "Brown", "name": "Dr. Emmett Brown", "email": "doc.brown@timekit.io", "img": "http:\/\/www.gravatar.com\/avatar\/35b00087ea20066e5da95f8359183f04", "activated": true, "timezone": "America\/Los_Angeles", "id": "TWXVID51gpqKcLVMQauomHqIrw92acw8", "last_sync": null, "api_token": "nvHfRSlhvsnlg4rS7Wt28Ty47qdgegwSu3YK7hPW" } }'
      });

      utils.tick(function () {
        var email = response.data.email;
        var apiToken = response.data.api_token;
        expect(email).toBeDefined();
        expect(typeof email).toBe('string');
        expect(apiToken).toBeDefined();
        expect(typeof apiToken).toBe('string');
        expect(timekit.getUser()).toEqual({
          email: fixtures.userEmail,
          apiToken: apiToken
        });
        done();
      });
    });

  });

  it('should be able to fail authentication with wrong credentials by calling [GET] /auth', function(done) {
    var response, request;

    timekit.auth({
      email: fixtures.userInvalidEmail,
      password: fixtures.userPassword
    }).catch(function(res) {
      response = res;
    });

    utils.tick(function () {
      request = jasmine.Ajax.requests.mostRecent();

      request.respondWith({
        status: 401,
        responseText: {error:{message: "Email and password does not match any user"}},
      });

      utils.tick(function () {
        expect(typeof response.data.error.message).toBe('string');
        expect(response.status).toBe(401);
        expect(timekit.getUser()).toEqual({
          email: '',
          apiToken: ''
        });
        done();
      });
    });

  });

  it('should be able to call [GET] /accounts/google/signup endpoint', function() {

    var result = timekit.accountGoogleSignup();

    // should match a valid HTTP(S) url
    expect(result).toMatch(/^((https?:)(\/\/\/?)([\w]*(?::[\w]*)?@)?([\d\w\.-]+)(?::(\d+))?)?([\/\\\w\.()-]*)?(?:([?][^#]*)?(#.*)?)*/gmi);

  });

});
