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
var humps = require('humps');
var merge = require('deepmerge');
var utils = require('./utils');
var endpoints = require('./endpoints');
var deprecatedEndpoints = require('./deprecated_endpoints');

function Timekit() {

  /**
   * Auth variables for login gated API methods
   * @type {String}
   */
  var includes = [];
  var headers = {};
  var nextPayload = {};

  /**
   * Default config
   * @type {Object}
   */
  var config = {
    app: '',
    apiBaseUrl: 'https://api.timekit.io/',
    apiVersion: 'v2',
    convertResponseToCamelcase: false,
    convertRequestToSnakecase: true,
    autoFlattenResponse: true,
    resourceEmail: null,
    resourceKey: null,
    appKey: null,
  };

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

    // Handle chained payload data if applicable
    args = utils.mergeNextPayload(args, nextPayload)
    nextPayload = {};

    // construct URL with base, version and endpoint
    args.url = utils.buildUrl(args.url, config);

    // add http headers if applicable
    args.headers = args.headers || headers || {};

    if (config.headers) {
      args.headers = merge(config.headers, args.headers)
    }
    if (!args.headers['Timekit-App'] && config.app) {
      args.headers['Timekit-App'] = config.app;
    }
    if (config.inputTimestampFormat) {
      args.headers['Timekit-InputTimestampFormat'] = config.inputTimestampFormat;
    }
    if (config.outputTimestampFormat) {
      args.headers['Timekit-OutputTimestampFormat'] = config.outputTimestampFormat;
    }
    if (config.timezone) {
      args.headers['Timekit-Timezone'] = config.timezone;
    }

    // add auth headers (personal token) if not being overwritten by request/asUser
    if (!args.headers['Authorization'] && config.resourceEmail && config.resourceKey) {
      args.headers['Authorization'] = 'Basic ' + utils.encodeAuthHeader(config.resourceEmail, config.resourceKey);
    }

    // add auth headers (app token)
    if (!args.headers['Authorization'] && config.appKey) {
      args.headers['Authorization'] = 'Basic ' + utils.encodeAuthHeader('', config.appKey);
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
          response = utils.copyResponseMetaData(response)
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
  TK.setUser = function(email, apiKey) {
    config.resourceEmail = email;
    config.resourceKey = apiKey;
  };

  /**
   * Returns the current active user
   * @type {Function}
   * @return {Object}
   */
  TK.getUser = function() {
    return {
      email: config.resourceEmail,
      apiToken: config.resourceKey
    };
  };

  /**
   * Set app token (happens automatically on timekit.auth())
   * @type {Function}
   */
  TK.setAppKey = function(apiKey) {
    config.appKey = apiKey;
  };

  /**
   * Returns the app token
   * @type {Function}
   * @return {Object}
   */
  TK.getAppKey = function() {
    return config.appKey
  };

  /**
   * Set the active user temporarily for the next request (fluent/chainable return)
   * @type {Function}
   */
  TK.asUser = function(email, apiKey) {
    headers['Authorization'] = 'Basic ' + utils.encodeAuthHeader(email, apiKey);
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
    headers = merge(headers, data)
    return this;
  };

  /**
   * Add supplied payload to the next request only
   * @type {Function}
   * @return {Object}
   */
  TK.carry = function(data) {
    nextPayload = merge(nextPayload, data)
    return this;
  };

  /**
   * Return a new instance of the SDK
   * @type {Function}
   * @return {Object}
   */
  TK.newInstance = function() {
    return new Timekit();
  };

  /**
   * Redirect to the Google signup/login page
   * Kept this in this file (not endpoints.js) because of internal dependencies to headers, config etc.
   * @type {Function}
   * @return {String}
   */
  TK.accountGoogleSignup = function(data, shouldAutoRedirect) {

    var app = config.app;

    // If app header exists (using .asApp() function), use that
    if (headers['Timekit-App']) {
      app = headers['Timekit-App'];
    }

    var baseUrl = utils.buildUrl('/accounts/google/signup', config);
    var finalUrl = baseUrl + '?Timekit-App=' + app + (data && data.callback ? '&callback=' + data.callback : '')

    if(shouldAutoRedirect && window) {
      window.location.href = finalUrl;
    } else {
      return finalUrl;
    }

  };

  /**
   * Redirect to the Microsoft signup/login page
   * Kept this in this file (not endpoints.js) because of internal dependencies to headers, config etc.
   * @type {Function}
   * @return {String}
   */
  TK.accountMicrosoftSignup = function(data, shouldAutoRedirect) {

    var app = config.app;

    // If app header exists (using .asApp() function), use that
    if (headers['Timekit-App']) {
      app = headers['Timekit-App'];
    }

    var baseUrl = utils.buildUrl('/accounts/microsoft/signup', config);
    var finalUrl = baseUrl + '?Timekit-App=' + app + (data && data.callback ? '&callback=' + data.callback : '')

    if(shouldAutoRedirect && window) {
      window.location.href = finalUrl;
    } else {
      return finalUrl;
    }

  };

  /**
   * Import endpoint defintions
   */
  TK = endpoints(TK)

  /**
   * Import deprecated endpoint defintions
   */
  TK = deprecatedEndpoints(TK)

  return TK;

}

module.exports = new Timekit();
