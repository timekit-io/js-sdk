'use strict';

/*!
 * Timekit JavaScript SDK
 * http://timekit.io
 *
 * Copyright 2015 Timekit, Inc.
 * The Timekit JavaScript SDK is freely distributable under the MIT license.
 *
 */
var axios = require('axios');
var base64 = require('base-64');
var humps = require('humps');

function Timekit() {

  /**
   * Auth variables for login gated API methods
   * @type {String}
   */
  var userEmail;
  var userToken;
  var includes = [];
  var headers = {};

  /**
   * Default config
   * @type {Object}
   */
  var config = {
    app: 'demo',
    apiBaseUrl: 'https://api.timekit.io/',
    apiVersion: 'v2',
    convertResponseToCamelcase: false,
    convertRequestToSnakecase: true,
    autoFlattenResponse: true
  };

  /**
   * Generate base64 string for basic auth purposes
   * @type {Function}
   * @return {String}
   */

  var encodeAuthHeader = function(email, token) {
    return base64.encode(email + ':' + token);
  };

  /**
   * Build absolute URL for API call
   * @type {Function}
   * @return {String}
   */
  var buildUrl = function(endpoint) {
    return config.apiBaseUrl + config.apiVersion + endpoint;
  };

  var copyResponseMetaData = function(response) {
    if (Object.keys(response.data).length < 2) return
    response.metaData = {}
    Object.keys(response.data).forEach(function(key) {
      if (key !== 'data') response.metaData[key] = response.data[key]
    })
  }

  /**
   * Root Object that holds methods to expose for API consumption
   * @type {Object}
   */
  var TK = {};

  /**
   * Prepare and make HTTP request to API
   * @type {Object}
   * @return {Promise}
   */
  TK.makeRequest = function(args) {

    // construct URL with base, version and endpoint
    args.url = buildUrl(args.url);

    // add http headers if applicable
    args.headers = args.headers || headers || {};

    if (!args.headers['Timekit-App']) args.headers['Timekit-App'] = config.app;
    if (config.inputTimestampFormat) { args.headers['Timekit-InputTimestampFormat'] = config.inputTimestampFormat; }
    if (config.outputTimestampFormat) { args.headers['Timekit-OutputTimestampFormat'] = config.outputTimestampFormat; }
    if (config.timezone) { args.headers['Timekit-Timezone'] = config.timezone; }

    // add auth headers if not being overwritten by request/asUser
    if (!args.headers['Authorization'] && userEmail && userToken) {
      args.headers['Authorization'] = 'Basic ' + encodeAuthHeader(userEmail, userToken);
    }

    // reset headers
    if (Object.keys(headers).length > 0) {
      headers = {};
    }

    // add dynamic includes if applicable
    if (includes && includes.length > 0) {
      if (args.params === undefined) { args.params = {}; }
      args.params.include = includes.join();
      includes = [];
    }

    // decamelize keys in data objects
    if (args.data && config.convertRequestToSnakecase) { args.data = humps.decamelizeKeys(args.data); }

    // register response interceptor for data manipulation
    var interceptor = axios.interceptors.response.use(function (response) {
      if (response.data && response.data.data) {
        if (config.autoFlattenResponse) {
          copyResponseMetaData(response)
          response.data = response.data.data;
        }
        if (config.convertResponseToCamelcase) {
          response.data = humps.camelizeKeys(response.data);
        }
      }
      return response;
    }, function (error) {
      return Promise.reject(error);
    });

    // execute request!
    var request = axios(args);

    // deregister response interceptor
    axios.interceptors.response.eject(interceptor);

    return request;
  };

  /**
   * Overwrite default config with supplied settings
   * @type {Function}
   * @return {Object}
   */
  TK.configure = function(custom) {
    for (var attr in custom) { config[attr] = custom[attr]; }
    return config;
  };

  /**
   * Returns the current config
   * @type {Function}
   * @return {Object}
   */
  TK.getConfig = function() {
    return config;
  };

  /**
   * Set the active user manually (happens automatically on timekit.auth())
   * @type {Function}
   */
  TK.setUser = function(email, apiToken) {
    userEmail = email;
    userToken = apiToken;
  };

  /**
   * Returns the current active user
   * @type {Function}
   * @return {Object}
   */
  TK.getUser = function() {
    return {
      email: userEmail,
      apiToken: userToken
    };
  };

  /**
   * Set the active user temporarily for the next request (fluent/chainable return)
   * @type {Function}
   */
  TK.asUser = function(email, apiToken) {
    headers['Authorization'] = 'Basic ' + encodeAuthHeader(email, apiToken);
    return this;
  };

  /**
  * Set the timekit app slug temporarily for the next request (fluent/chainable return)
  * @type {Function}
  */
  TK.asApp = function(slug) {
    headers['Timekit-App'] = slug;
    return this;
  };

  /**
   * Add supplied dynamic includes to the next request (fluent/chainable return)
   * @type {Function}
   * @return {Object}
   */
  TK.include = function() {
    includes = Array.prototype.slice.call(arguments);
    return this;
  };

  /**
   * Add supplied headers to the next request (fluent/chainable return)
   * @type {Function}
   * @return {Object}
   */
  TK.headers = function(data) {
    for (var attr in data) { headers[attr] = data[attr]; }
    return this;
  };

  /**
   * Get user's connected accounts
   * @type {Function}
   * @return {Promise}
   */
  TK.getAccounts = function() {

    return TK.makeRequest({
      url: '/accounts',
      method: 'get'
    });

  };

  /**
   * Redirect to the Google signup/login page
   * @type {Function}
   * @return {String}
   */
  TK.accountGoogleSignup = function(data, shouldAutoRedirect) {

    var url = buildUrl('/accounts/google/signup') + '?Timekit-App=' + config.app + (data && data.callback ? '&callback=' + data.callback : '');

    if(shouldAutoRedirect && window) {
      window.location.href = url;
    } else {
      return url;
    }

  };

  /**
   * Get user's Google calendars
   * @type {Function
   * @return {Promise}
   */
  TK.getAccountGoogleCalendars = function() {

    return TK.makeRequest({
      url: '/accounts/google/calendars',
      method: 'get'
    });

  };

  /**
   * Initiate an account sync
   * @type {Function}
   * @return {Promise}
   */
  TK.accountSync = function(data) {

    return TK.makeRequest({
      url: '/accounts/sync',
      method: 'get',
      params: data
    });

  };

  /**
   * Initiate an account sync where only calendar models are synced
   * @type {Function}
   * @return {Promise}
   */
  TK.accountSyncCalendars = function(data) {

    return TK.makeRequest({
      url: '/accounts/sync/calendars',
      method: 'get',
      params: data
    });

  };

  /**
   * Authenticate a user to retrive API token for future calls
   * @type {Function}
   * @return {Promise}
   */
  TK.auth = function(data) {

    var r = TK.makeRequest({
      url: '/auth',
      method: 'post',
      data: data
    });

    r.then(function(response) {
      TK.setUser(response.data.email, response.data.api_token);
    }).catch(function(){
      TK.setUser('','');
    });

    return r;

  };

  /**
   * Get list of apps
   * @type {Function}
   * @return {Promise}
   */
  TK.getApps = function() {

    return TK.makeRequest({
      url: '/apps',
      method: 'get'
    });

  };

  /**
   * Get settings for a specific app
   * @type {Function}
   * @return {Promise}
   */
  TK.getApp = function(data) {

    return TK.makeRequest({
      url: '/apps/' + data.slug,
      method: 'get'
    });

  };

  /**
   * Create a new Timekit app
   * @type {Function}
   * @return {Promise}
   */
  TK.createApp = function(data) {

    return TK.makeRequest({
      url: '/apps',
      method: 'post',
      data: data
    });

  };

  /**
   * Update settings for a specific app
   * @type {Function}
   * @return {Promise}
   */
  TK.updateApp = function(data) {

    var slug = data.slug;
    delete data.slug;

    return TK.makeRequest({
      url: '/apps/' + slug,
      method: 'put',
      data: data
    });

  };

  /**
   * Delete an app
   * @type {Function}
   * @return {Promise}
   */
  TK.deleteApp = function(data) {

    return TK.makeRequest({
      url: '/apps/' + data.slug,
      method: 'delete'
    });

  };

  /**
   * Get users calendars that are present on Timekit (synced from providers)
   * @type {Function}
   * @return {Promise}
   */
  TK.getCalendars = function() {

    return TK.makeRequest({
      url: '/calendars',
      method: 'get'
    });

  };

  /**
   * Get users calendars that are present on Timekit (synced from providers)
   * @type {Function}
   * @return {Promise}
   */
  TK.getCalendar = function(data) {

    return TK.makeRequest({
      url: '/calendars/' + data.id,
      method: 'get'
    });

  };

  /**
   * Create a new calendar for current user
   * @type {Function}
   * @return {Promise}
   */
  TK.createCalendar = function(data) {

    return TK.makeRequest({
      url: '/calendars/',
      method: 'post',
      data: data
    });

  };

  /**
   * Update a calendar for current user
   * @type {Function}
   * @return {Promise}
   */
  TK.updateCalendar = function(data) {

    var id = data.id;
    delete data.id;

    return TK.makeRequest({
      url: '/calendars/' + id,
      method: 'put',
      data: data
    });

  };

  /**
   * Delete a calendar
   * @type {Function}
   * @return {Promise}
   */
  TK.deleteCalendar = function(data) {

    return TK.makeRequest({
      url: '/calendars/' + data.id,
      method: 'delete'
    });

  };

  /**
   * Get users contacts that are present on Timekit (synced from providers)
   * @type {Function}
   * @return {Promise}
   */
  TK.getContacts = function() {

    return TK.makeRequest({
      url: '/contacts/',
      method: 'get'
    });

  };

  /**
   * Get all user's events
   * @type {Function}
   * @return {Promise}
   */
  TK.getEvents = function(data) {

    return TK.makeRequest({
      url: '/events',
      method: 'get',
      params: data
    });

  };

  /**
   * Get a user's event by ID
   * @type {Function}
   * @return {Promise}
   */
  TK.getEvent = function(data) {

    return TK.makeRequest({
      url: '/events/' + data.id,
      method: 'get'
    });

  };

  /**
   * Create a new event
   * @type {Function}
   * @return {Promise}
   */
  TK.createEvent = function(data) {

    return TK.makeRequest({
      url: '/events',
      method: 'post',
      data: data
    });

  };

  /**
   * Update an existing event
   * @type {Function}
   * @return {Promise}
   */
  TK.updateEvent = function(data) {

    var id = data.id;
    delete data.id;

    return TK.makeRequest({
      url: '/events/' + id,
      method: 'put',
      data: data
    });

  };

  /**
   * Delete a user's event by ID
   * @type {Function}
   * @return {Promise}
   */
  TK.deleteEvent = function(data) {

    return TK.makeRequest({
      url: '/events/' + data.id,
      method: 'delete'
    });

  };

  /**
   * Get a user's anonymized availability (other user's on Timekit can be queryied by supplying their email)
   * @type {Function}
   * @return {Promise}
   */
  TK.getAvailability = function(data) {

    return TK.makeRequest({
      url: '/events/availability',
      method: 'get',
      params: data
    });

  };

  /**
   * Find mutual availability across multiple users/calendars
   * @type {Function}
   * @return {Promise}
   */
  TK.findTime = function(data) {

    return TK.makeRequest({
      url: '/findtime',
      method: 'post',
      data: data
    });

  };

  /**
   * Find mutual availability across multiple users/calendars
   * @type {Function}
   * @return {Promise}
   */
  TK.findTimeBulk = function(data) {

    return TK.makeRequest({
      url: '/findtime/bulk',
      method: 'post',
      data: data
    });

  };

  /**
   * Create a new user with the given properties
   * @type {Function}
   * @return {Promise}
   */
  TK.createUser = function(data) {

    return TK.makeRequest({
      url: '/users',
      method: 'post',
      data: data
    });

  };

  /**
   * Fetch current user data from server
   * @type {Function}
   * @return {Promise}
   */
  TK.getUserInfo = function() {

    return TK.makeRequest({
      url: '/users/me',
      method: 'get'
    });

  };

  /**
   * Fetch current user data from server
   * @type {Function}
   * @return {Promise}
   */
  TK.updateUser = function(data) {

    return TK.makeRequest({
      url: '/users/me',
      method: 'put',
      data: data
    });

  };

  /**
   * Reset password for a user
   * @type {Function}
   * @return {Promise}
   */
  TK.resetUserPassword = function(data) {

    return TK.makeRequest({
      url: '/users/resetpassword',
      method: 'post',
      data: data
    });

  };

  /**
   * Get a specific users' timezone
   * @type {Function}
   * @return {Promise}
   */
  TK.getUserTimezone = function(data) {

    return TK.makeRequest({
      url: '/users/timezone/' + data.email,
      method: 'get'
    });

  };

  /**
   * Get all user auth credentials
   * @type {Function}
   * @return {Promise}
   */
  TK.getCredentials = function() {

    return TK.makeRequest({
      url: '/credentials',
      method: 'get'
    });

  };

  /**
   * Create a new pair of auth credentials
   * @type {Function}
   * @return {Promise}
   */
  TK.createCredential = function(data) {

    return TK.makeRequest({
      url: '/credentials',
      method: 'post',
      data: data
    });

  };

  /**
   * Delete a pair of auth credentials
   * @type {Function}
   * @return {Promise}
   */
  TK.deleteCredential = function(data) {

    return TK.makeRequest({
      url: '/credentials/' + data.id,
      method: 'delete'
    });

  };

  /**
   * Get all bookings
   * @type {Function}
   * @return {Promise}
   */
  TK.getBookings = function() {

    return TK.makeRequest({
      url: '/bookings',
      method: 'get'
    });

  };

  /**
   * Get specific booking
   * @type {Function}
   * @return {Promise}
   */
  TK.getBooking = function(data) {

    return TK.makeRequest({
      url: '/bookings/' + data.id,
      method: 'get'
    });

  };

  /**
   * Create a new booking
   * @type {Function}
   * @return {Promise}
   */
  TK.createBooking = function(data) {

    return TK.makeRequest({
      url: '/bookings',
      method: 'post',
      data: data
    });

  };

  /**
   * Update an existing booking
   * @type {Function}
   * @return {Promise}
   */
  TK.updateBooking = function(data) {

    var id = data.id;
    delete data.id;

    var action = data.action;
    delete data.action;

    return TK.makeRequest({
      url: '/bookings/' + id + '/' + action,
      method: 'put',
      data: data
    });

  };

  /**
   * Get widgets
   * @type {Function}
   * @return {Promise}
   */
  TK.getWidgets = function() {

    return TK.makeRequest({
      url: '/widgets',
      method: 'get'
    });

  };

  /**
   * Get a specific widget
   * @type {Function}
   * @return {Promise}
   */
  TK.getWidget = function(data) {

    return TK.makeRequest({
      url: '/widgets/' + data.id,
      method: 'get'
    });

  };

  /**
   * Get public widget by slug
   * @type {Function}
   * @return {Promise}
   */
  TK.getHostedWidget = function(data) {

    return TK.makeRequest({
      url: '/widgets/hosted/' + data.slug,
      method: 'get'
    });

  };

  /**
   * Get public widget by slug
   * @type {Function}
   * @return {Promise}
   */
  TK.getEmbedWidget = function(data) {

    return TK.makeRequest({
      url: '/widgets/embed/' + data.id,
      method: 'get'
    });

  };

  /**
   * Create a new widget
   * @type {Function}
   * @return {Promise}
   */
  TK.createWidget = function(data) {

    return TK.makeRequest({
      url: '/widgets',
      method: 'post',
      data: data
    });

  };

  /**
   * Update an existing widget
   * @type {Function}
   * @return {Promise}
   */
  TK.updateWidget = function(data) {

    var id = data.id;
    delete data.id;

    return TK.makeRequest({
      url: '/widgets/' + id,
      method: 'put',
      data: data
    });

  };

  /**
   * Delete a widget
   * @type {Function}
   * @return {Promise}
   */
  TK.deleteWidget = function(data) {

    return TK.makeRequest({
      url: '/widgets/' + data.id,
      method: 'delete'
    });

  };

  return TK;

}

module.exports = new Timekit();
