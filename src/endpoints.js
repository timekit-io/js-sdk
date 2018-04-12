var utils = require('./utils')

module.exports = function (TK) {

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

      var token = response.data.api_token || response.data.apiToken;

      TK.setUser(response.data.email, token);

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
  TK.getApp = function() {

    return TK.makeRequest({
      url: '/app',
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
   * Fetch current resource data from server
   * @type {Function}
   * @return {Promise}
   */
  TK.getResources = function() {

    return TK.makeRequest({
      url: '/resources',
      method: 'get'
    });

  };

  /**
   * Fetch current resource data from server
   * @type {Function}
   * @return {Promise}
   */
  TK.getResource = function(data) {

    return TK.makeRequest({
      url: '/resources/' + data.id,
      method: 'get'
    });

  };

  /**
   * Create a new resource with the given properties
   * @type {Function}
   * @return {Promise}
   */
  TK.createResource = function(data) {

    return TK.makeRequest({
      url: '/resources',
      method: 'post',
      data: data
    });

  };

  /**
   * Fetch current resource data from server
   * @type {Function}
   * @return {Promise}
   */
  TK.updateResource = function(data) {

    var id = data.id;
    delete data.id;

    return TK.makeRequest({
      url: '/resources/' + id,
      method: 'put',
      data: data
    });

  };

  /**
   * Reset password for a resource
   * @type {Function}
   * @return {Promise}
   */
  TK.resetResourcePassword = function(data) {

    return TK.makeRequest({
      url: '/resources/resetpassword',
      method: 'post',
      data: data
    });

  };

  /**
   * Get a specific resource's timezone
   * @type {Function}
   * @return {Promise}
   */
  TK.getResourceTimezone = function(data) {

    return TK.makeRequest({
      url: '/resources/timezone/' + data.email,
      method: 'get'
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
   * Find bulk availability across multiple users/calendars
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
   * Find team availability across multiple users/calendars
   * @type {Function}
   * @return {Promise}
   */
  TK.findTimeTeam = function(data) {

    return TK.makeRequest({
      url: '/findtime/team',
      method: 'post',
      data: data
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
   * Create bookings in bulk
   * @type {Function}
   * @return {Promise}
   */
  TK.createBookingsBulk = function(data) {

    return TK.makeRequest({
      url: '/bookings/bulk',
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
   * Update an bookings in bulk
   * @type {Function}
   * @return {Promise}
   */
  TK.updateBookingsBulk = function(data) {

    return TK.makeRequest({
      url: '/bookings/bulk',
      method: 'put',
      data: data
    });

  };

  /**
   * Get all bookings
   * @type {Function}
   * @return {Promise}
   */
  TK.getGroupBookings = function() {

    return TK.makeRequest({
      url: '/bookings/groups',
      method: 'get'
    });

  };

  /**
   * Get specific booking
   * @type {Function}
   * @return {Promise}
   */
  TK.getGroupBooking = function(data) {

    return TK.makeRequest({
      url: '/bookings/' + data.id + '/groups',
      method: 'get'
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
