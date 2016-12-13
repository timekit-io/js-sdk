'use strict';

var moment = require('moment');
var timekit = require('../src/timekit.js');
var utils = require('./helpers/utils');

var fixtures = {
  app:            'demo',
  apiBaseUrl:     'http://api-localhost.timekit.io/',
  userEmail:      'timebirdcph@gmail.com',
  userInvalidEmail: 'invaliduser@gmail.com',
  userPassword:   'password',
  userApiToken:   'password'
}

/**
 * Call API endpoints that requires auth headers
 */
describe('Endpoints', function() {

  it('should be able to call an endpoint through a method', function(done) {
    var request, response;

    jasmine.Ajax.install();

    timekit.configure({
      app: fixtures.app,
      apiBaseUrl: fixtures.apiBaseUrl
    });

    timekit.setUser(fixtures.userEmail, fixtures.userApiToken);

    timekit.getAccounts()
    .then(function(res) {
      response = res;
    });

    utils.tick(function() {
      request = jasmine.Ajax.requests.mostRecent();

      request.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{ "data": [ { "provider": "google", "provider_id": "timebirdcph@gmail.com", "last_sync": "2015-03-17 15:51:43" }, { "provider": "google", "provider_id": "timebirdnyc@gmail.com", "last_sync": "2015-03-17 15:51:43" } ] }',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      utils.tick(function () {
        expect(response.data).toBeDefined();
        expect(Object.prototype.toString.call(response.data)).toBe('[object Array]');
        jasmine.Ajax.uninstall();
        done();
      });
    });

  });

  it('should support all API endpoints as methods', function() {

    var methods = {

      // Accounts
      'getAccounts': 0,
      'accountGoogleSignup': 2,
      'getAccountGoogleCalendars': 0,
      'accountSync': 1,
      'accountSyncCalendars': 1,

      // Auth
      'auth': 1,

      // Apps
      'getApps': 0,
      'getApp': 1,
      'createApp': 1,
      'updateApp': 1,
      'deleteApp': 1,

      // Calendars
      'getCalendars': 0,
      'getCalendar': 1,
      'createCalendar': 1,
      'updateCalendar': 1,
      'deleteCalendar': 1,

      // Contacts
      'getContacts': 0,

      // Events
      'getEvents': 1,
      'getEvent': 1,
      'createEvent': 1,
      'updateEvent': 1,
      'deleteEvent': 1,
      'getAvailability': 1,

      // FindTime
      'findTime': 1,
      'findTimeBulk': 1,

      // Users
      'createUser': 1,
      'getUserInfo': 0,
      'updateUser': 1,
      'resetUserPassword': 1,
      'getUserTimezone': 1,

      // Credentials
      'getCredentials': 0,
      'createCredential': 1,
      'deleteCredential': 1,

      // Bookings
      'getBookings': 0,
      'getBooking': 1,
      'createBooking': 1,
      'updateBooking': 1,

      // Widgets
      'getWidgets': 0,
      'getWidget': 1,
      'getHostedWidget': 1,
      'getEmbedWidget': 1,
      'createWidget': 1,
      'updateWidget': 1,
      'deleteWidget': 1

    }

    Object.keys(methods).forEach(function(key) {

      expect(typeof timekit[key]).toBe('function');
      expect(timekit[key]).toBeDefined();
      expect(timekit[key].length).toEqual(methods[key]);

    });

  });

});
