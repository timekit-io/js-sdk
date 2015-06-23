'use strict';

var moment = require('moment');
var timekit = require('../src/timekit');

var fixtures = {
  app:            'timebird',
  apiBaseUrl:     'http://api-localhost.timekit.io/',
  calendarToken:  '1e396a70-1919-11e5-a165-080027c7e7dd',
  userEmail:      'timebirdcph@gmail.com',
  userInvalidEmail: 'invaliduser@gmail.com',
  userPassword:   'password',
  findTimeEmail1: 'timebirdcph@gmail.com',
  findTimeEmail2: 'timebirdnyc@gmail.com',
  findTimeFuture: '3 days',
  findTimeLength: '30 minutes',
  eventsStart:    moment().format(),
  eventsEnd:      moment().add(3,'weeks').format(),
  availabilityEmail: 'timebirdnyc@gmail.com'
}

/**
 * Call API endpoints that doesnt require auth headers
 */
describe('API endpoints without auth', function() {

  beforeEach(function() {

    timekit.configure({
      app: fixtures.app,
      apiBaseUrl: fixtures.apiBaseUrl
    });

  });

  it('should be able to authenticate by calling [GET] /auth', function(done) {

    timekit.auth(fixtures.userEmail, fixtures.userPassword)
    .then(function(response) {
      expect(response.data.data.email).toBeDefined();
      expect(typeof response.data.data.email).toBe('string');
      expect(response.data.data.api_token).toBeDefined();
      expect(typeof response.data.data.api_token).toBe('string');
      done();
    });

  });

  it('should be able to fail authentication with wrong credentials by calling [GET] /auth', function(done) {

    timekit.auth(fixtures.userInvalidEmail, fixtures.userPassword)
    .catch(function(response) {
      expect(typeof response.data.error.message).toBe('string');
      expect(response.data.error.status_code).toBe(401);
      done();
    });

  });

  it('should be able to call [GET] /accounts/google/signup endpoint', function() {

    var result = timekit.accountGoogleSignup();

    // should match a valid HTTP(S) url
    expect(result).toMatch(/^((https?:)(\/\/\/?)([\w]*(?::[\w]*)?@)?([\d\w\.-]+)(?::(\d+))?)?([\/\\\w\.()-]*)?(?:([?][^#]*)?(#.*)?)*/gmi);

  });

});

/**
 * Call API endpoints that requires auth headers
 */
describe('API endpoints with auth', function() {

  beforeEach(function(done) {

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

    timekit.configure({
      app: fixtures.app,
      apiBaseUrl: fixtures.apiBaseUrl
    });

    timekit.auth(fixtures.userEmail, fixtures.userPassword)
    .then(function(response) {
      done();
    });

  });

  it('should be able to call [POST] /findtime endpoint', function(done) {

    timekit.findTime(
      [fixtures.findTimeEmail1, fixtures.findTimeEmail2],
      fixtures.findTimeFuture,
      fixtures.findTimeLength
    ).then(function(response) {
      expect(response.data).toBeDefined();
      expect(Object.prototype.toString.call(response.data.data)).toBe('[object Array]');
      done();
    });

  });

  it('should be able to call [GET] /accounts endpoint', function(done) {

    timekit.getAccounts().then(function(response) {
      expect(response.data).toBeDefined();
      expect(Object.prototype.toString.call(response.data.data)).toBe('[object Array]');
      done();
    });

  });

  it('should be able to call [GET] /accounts/google/calendars endpoint', function(done) {

    timekit.getAccountGoogleCalendars().then(function(response) {
      expect(response.data).toBeDefined();
      expect(Object.prototype.toString.call(response.data.data)).toBe('[object Array]');
      done();
    });

  });

  it('should be able to call [GET] /accounts/sync endpoint', function(done) {

    timekit.accountSync().then(function(response) {
      expect(response.data).toBeDefined();
      expect(typeof response.data.count).toBe('number');
      done();
    });

  });

  it('should be able to call [GET] /calendars', function(done) {

    timekit.getCalendars().then(function(response) {
      expect(response.data).toBeDefined();
      expect(Object.prototype.toString.call(response.data.data)).toBe('[object Array]');
      done();
    });

  });

  it('should be able to call [GET] /calendar/:token', function(done) {

    timekit.getCalendar(fixtures.calendarToken).then(function(response) {
      expect(response.data).toBeDefined();
      expect(typeof response.data.data.name).toBe('string');
      done();
    });

  });

  it('should be able to call [GET] /contacts', function(done) {

    timekit.getContacts().then(function(response) {
      expect(response.data).toBeDefined();
      expect(Object.prototype.toString.call(response.data.data)).toBe('[object Array]');
      done();
    });

  });

  it('should be able to call [GET] /events', function(done) {

    timekit.getEvents(
      fixtures.eventsStart,
      fixtures.eventsEnd
    ).then(function(response) {
      expect(response.data).toBeDefined();
      expect(Object.prototype.toString.call(response.data.data)).toBe('[object Array]');
      done();
    });

  });

  it('should be able to call [GET] /events/availability', function(done) {

    timekit.getAvailability(
      fixtures.eventsStart,
      fixtures.eventsEnd,
      fixtures.availabilityEmail
    ).then(function(response) {
      expect(response.data).toBeDefined();
      expect(Object.prototype.toString.call(response.data.data)).toBe('[object Array]');
      done();
    });

  });

});
