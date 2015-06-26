(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("axios"));
	else if(typeof define === 'function' && define.amd)
		define(["axios"], factory);
	else if(typeof exports === 'object')
		exports["timekit"] = factory(require("axios"));
	else
		root["timekit"] = factory(root["axios"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/*!
	 * Timekit JavaScript SDK
	 * Version: 0.0.1
	 * http://timekit.io
	 *
	 * Copyright 2015 Timekit, Inc.
	 * The Timekit JavaScript SDK is freely distributable under the MIT license.
	 *
	 */
	var axios = __webpack_require__(1);
	var base64 = __webpack_require__(2);
	
	function Timekit() {
	
	  /**
	   * Auth variables for login gated API methods
	   * @type {String}
	   */
	  var userEmail;
	  var userApiToken;
	
	  /**
	   * Default config
	   * @type {Object}
	   */
	  var config = {
	    app: 'demo',
	    apiBaseUrl: 'https://api.timekit.io/',
	    apiVersion: 'v2'
	  };
	
	  /**
	   * Generate base64 string for basic auth purposes
	   * @type {Function}
	   * @return {String}
	   */
	
	  var encodeAuthHeader = function() {
	    return base64.encode(userEmail + ':' + userApiToken);
	  };
	
	  /**
	   * Build absolute URL for API call
	   * @type {Function}
	   * @return {String}
	   */
	  var buildUrl = function(endpoint) {
	    return config.apiBaseUrl + config.apiVersion + endpoint;
	  };
	
	  /**
	   * Prepare and make HTTP request to API
	   * @type {Object}
	   * @return {Promise}
	   */
	  var makeRequest = function(args) {
	
	    args.url = buildUrl(args.url);
	    args.headers = {
	      'Timekit-App': config.app,
	    };
	
	    if (userEmail && userApiToken) { args.headers.Authorization = 'Basic ' + encodeAuthHeader(); }
	    if (config.inputTimestampFormat) { args.headers['Timekit-InputTimestampFormat'] = config.inputTimestampFormat; }
	    if (config.outputTimestampFormat) { args.headers['Timekit-OutputTimestampFormat'] = config.outputTimestampFormat; }
	    if (config.timezone) { args.headers['Timekit-Timezone'] = config.timezone; }
	
	    // args.transformResponse = [function(response) {
	    //   // console.log('transformResponse');
	    //   // console.log(JSON.parse(response));
	    //   // if (response.data) {
	    //   //   response.result = response.data.data || response.data;
	    //   //   delete response.data;
	    //   // }
	    //   return response;
	    // }];
	
	    var request = axios(args);
	
	    return request;
	  };
	
	  /**
	   * Root Object that holds methods to expose for API consumption
	   * @type {Object}
	   */
	  var TK = {};
	
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
	   * Set the active user manuallt (happens automatically on timekit.auth())
	   * @type {Function}
	   */
	  TK.setUser = function(email, apiToken) {
	    if (email){ userEmail = email; }
	    if (apiToken) { userApiToken = apiToken; }
	  };
	
	  /**
	   * Returns the current active user
	   * @type {Function}
	   * @return {Object}
	   */
	  TK.getUser = function() {
	    return {
	      email: userEmail,
	      apiToken: userApiToken
	    };
	  };
	
	  /**
	   * Authenticate a user to retrive API token for future calls
	   * @type {Function}
	   * @return {Promise}
	   */
	  TK.auth = function(email, password) {
	
	    var r = makeRequest({
	      url: '/auth',
	      method: 'post',
	      data: {
	        email: email,
	        password: password
	      }
	    });
	
	    r.then(function(response) {
	      TK.setUser(response.data.data.email, response.data.data.api_token);
	    });
	
	    return r;
	
	  };
	
	  /**
	   * Find mutual availability across multiple users/calendars
	   * @type {Function}
	   * @return {Promise}
	   */
	  TK.findTime = function(emails, future, length) {
	
	    return makeRequest({
	      url: '/findtime',
	      method: 'post',
	      data: {
	        emails: emails,
	        future: future,
	        length: length
	      }
	    });
	
	  };
	
	  /**
	   * Get user's connected accounts
	   * @type {Function}
	   * @return {Promise}
	   */
	  TK.getAccounts = function() {
	
	    return makeRequest({
	      url: '/accounts',
	      method: 'get'
	    });
	
	  };
	
	  /**
	   * Redirect to the Google signup/login page
	   * @type {Function}
	   * @return {String}
	   */
	  TK.accountGoogleSignup = function(shouldRedirect) {
	
	    var url = buildUrl('/accounts/google/signup') + '?Timekit-App=' + config.app;
	
	    if(shouldRedirect && window) {
	      window.location.href = url;
	    } else {
	      return url;
	    }
	
	  };
	
	  /**
	   * Get user's Google calendars
	   * @type {Function}
	   * @return {Promise}
	   */
	  TK.getAccountGoogleCalendars = function() {
	
	    return makeRequest({
	      url: '/accounts/google/calendars',
	      method: 'get'
	    });
	
	  };
	
	  /**
	   * Initiate a server sync on all the users accounts
	   * @type {Function}
	   * @return {Promise}
	   */
	  TK.accountSync = function() {
	
	    return makeRequest({
	      url: '/accounts/sync',
	      method: 'get'
	    });
	
	  };
	
	  /**
	   * Get users calendars that are present on Timekit (synced from providers)
	   * @type {Function}
	   * @return {Promise}
	   */
	  TK.getCalendars = function() {
	
	    return makeRequest({
	      url: '/calendars',
	      method: 'get'
	    });
	
	  };
	
	  /**
	   * Get users calendars that are present on Timekit (synced from providers)
	   * @type {Function}
	   * @return {Promise}
	   */
	  TK.getCalendar = function(token) {
	
	    return makeRequest({
	      url: '/calendars/' + token,
	      method: 'get'
	    });
	
	  };
	
	  /**
	   * Get users contacts that are present on Timekit (synced from providers)
	   * @type {Function}
	   * @return {Promise}
	   */
	  TK.getContacts = function() {
	
	    return makeRequest({
	      url: '/contacts/',
	      method: 'get'
	    });
	
	  };
	
	  /**
	   * Get all user's events present from synced accounts (use FindTime for more detailed querying)
	   * @type {Function}
	   * @return {Promise}
	   */
	  TK.getEvents = function(start, end) {
	
	    return makeRequest({
	      url: '/events',
	      method: 'get',
	      params: {
	        start: start,
	        end: end
	      }
	    });
	
	  };
	
	  /**
	   * Get a user's anonymized availability (other user's on Timekit can be queryied by supplying their email)
	   * @type {Function}
	   * @return {Promise}
	   */
	  TK.getAvailability = function(start, end, email) {
	
	    return makeRequest({
	      url: '/events/availability',
	      method: 'get',
	      params: {
	        start: start,
	        end: end,
	        email: email
	      }
	    });
	
	  };
	
	  /**
	   * Get a user's meetings
	   * @type {Function}
	   * @return {Promise}
	   */
	  TK.getMeetings = function() {
	
	    return makeRequest({
	      url: '/meetings',
	      method: 'get'
	    });
	
	  };
	
	  /**
	   * Get a user's specific meeting
	   * @type {Function}
	   * @return {Promise}
	   */
	  TK.getMeeting = function(token) {
	
	    return makeRequest({
	      url: '/meetings/' + token,
	      method: 'get'
	    });
	
	  };
	
	  /**
	   * Get a user's specific meeting
	   * @type {Function}
	   * @return {Promise}
	   */
	  TK.createMeeting = function(what, where, suggestions) {
	
	    return makeRequest({
	      url: '/meetings',
	      method: 'post',
	      data: {
	        what: what,
	        where: where,
	        suggestions: suggestions
	      }
	    });
	
	  };
	
	  /**
	   * Get a user's specific meeting
	   * @type {Function}
	   * @return {Promise}
	   */
	  TK.updateMeeting = function(token, data) {
	
	    return makeRequest({
	      url: '/meetings/' + token,
	      method: 'put',
	      data: data
	    });
	
	  };
	
	  /**
	   * Set availability (true/faalse) on a meeting's suggestion
	   * @type {Function}
	   * @return {Promise}
	   */
	  TK.setMeetingAvailability = function(suggestionId, available) {
	
	    return makeRequest({
	      url: '/meetings/availability',
	      method: 'post',
	      data: {
	        suggestion_id: suggestionId,
	        available: available
	      }
	    });
	
	  };
	
	  /**
	   * Book/finalize the meeting, sending out meeting invites to all participants
	   * @type {Function}
	   * @return {Promise}
	   */
	  TK.bookMeeting = function(suggestionId) {
	
	    return makeRequest({
	      url: '/meetings/book',
	      method: 'post',
	      data: {
	        suggestion_id: suggestionId
	      }
	    });
	
	  };
	
	  /**
	   * Invite users/emails to a meeting, sending out invite emails to the supplied addresses
	   * @type {Function}
	   * @return {Promise}
	   */
	  TK.inviteToMeeting = function(token, emails) {
	
	    return makeRequest({
	      url: '/meetings/' + token + '/invite',
	      method: 'post',
	      data: {
	        emails: emails
	      }
	    });
	
	  };
	
	  /**
	   * Create a new user with the given properties
	   * @type {Function}
	   * @return {Promise}
	   */
	  TK.createUser = function(firstName, lastName, email, password, timezone) {
	
	    return makeRequest({
	      url: '/users',
	      method: 'post',
	      data: {
	        first_name: firstName,
	        last_name: lastName,
	        email: email,
	        password: password,
	        timezone: timezone
	      }
	    });
	
	  };
	
	  /**
	   * Fetch current user data from server
	   * @type {Function}
	   * @return {Promise}
	   */
	  TK.getUserInfo = function() {
	
	    return makeRequest({
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
	
	    return makeRequest({
	      url: '/users/me',
	      method: 'put',
	      data: data
	    });
	
	  };
	
	  /**
	   * Get a user property by key
	   * @type {Function}
	   * @return {Promise}
	   */
	  TK.getUserProperties = function() {
	
	    return makeRequest({
	      url: '/properties',
	      method: 'get'
	    });
	
	  };
	
	  /**
	   * Get a user property by key
	   * @type {Function}
	   * @return {Promise}
	   */
	  TK.getUserProperty = function(key) {
	
	    return makeRequest({
	      url: '/properties/' + key,
	      method: 'get'
	    });
	
	  };
	
	  /**
	   * Set or update user properties
	   * @type {Function}
	   * @return {Promise}
	   */
	  TK.setUserProperties = function(data) {
	
	    return makeRequest({
	      url: '/properties',
	      method: 'put',
	      data: data
	    });
	
	  };
	
	  return TK;
	
	}
	
	module.exports = new Timekit();


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global) {/*! http://mths.be/base64 v0.1.0 by @mathias | MIT license */
	;(function(root) {
	
		// Detect free variables `exports`.
		var freeExports = typeof exports == 'object' && exports;
	
		// Detect free variable `module`.
		var freeModule = typeof module == 'object' && module &&
			module.exports == freeExports && module;
	
		// Detect free variable `global`, from Node.js or Browserified code, and use
		// it as `root`.
		var freeGlobal = typeof global == 'object' && global;
		if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
			root = freeGlobal;
		}
	
		/*--------------------------------------------------------------------------*/
	
		var InvalidCharacterError = function(message) {
			this.message = message;
		};
		InvalidCharacterError.prototype = new Error;
		InvalidCharacterError.prototype.name = 'InvalidCharacterError';
	
		var error = function(message) {
			// Note: the error messages used throughout this file match those used by
			// the native `atob`/`btoa` implementation in Chromium.
			throw new InvalidCharacterError(message);
		};
	
		var TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
		// http://whatwg.org/html/common-microsyntaxes.html#space-character
		var REGEX_SPACE_CHARACTERS = /[\t\n\f\r ]/g;
	
		// `decode` is designed to be fully compatible with `atob` as described in the
		// HTML Standard. http://whatwg.org/html/webappapis.html#dom-windowbase64-atob
		// The optimized base64-decoding algorithm used is based on @atk’s excellent
		// implementation. https://gist.github.com/atk/1020396
		var decode = function(input) {
			input = String(input)
				.replace(REGEX_SPACE_CHARACTERS, '');
			var length = input.length;
			if (length % 4 == 0) {
				input = input.replace(/==?$/, '');
				length = input.length;
			}
			if (
				length % 4 == 1 ||
				// http://whatwg.org/C#alphanumeric-ascii-characters
				/[^+a-zA-Z0-9/]/.test(input)
			) {
				error(
					'Invalid character: the string to be decoded is not correctly encoded.'
				);
			}
			var bitCounter = 0;
			var bitStorage;
			var buffer;
			var output = '';
			var position = -1;
			while (++position < length) {
				buffer = TABLE.indexOf(input.charAt(position));
				bitStorage = bitCounter % 4 ? bitStorage * 64 + buffer : buffer;
				// Unless this is the first of a group of 4 characters…
				if (bitCounter++ % 4) {
					// …convert the first 8 bits to a single ASCII character.
					output += String.fromCharCode(
						0xFF & bitStorage >> (-2 * bitCounter & 6)
					);
				}
			}
			return output;
		};
	
		// `encode` is designed to be fully compatible with `btoa` as described in the
		// HTML Standard: http://whatwg.org/html/webappapis.html#dom-windowbase64-btoa
		var encode = function(input) {
			input = String(input);
			if (/[^\0-\xFF]/.test(input)) {
				// Note: no need to special-case astral symbols here, as surrogates are
				// matched, and the input is supposed to only contain ASCII anyway.
				error(
					'The string to be encoded contains characters outside of the ' +
					'Latin1 range.'
				);
			}
			var padding = input.length % 3;
			var output = '';
			var position = -1;
			var a;
			var b;
			var c;
			var d;
			var buffer;
			// Make sure any padding is handled outside of the loop.
			var length = input.length - padding;
	
			while (++position < length) {
				// Read three bytes, i.e. 24 bits.
				a = input.charCodeAt(position) << 16;
				b = input.charCodeAt(++position) << 8;
				c = input.charCodeAt(++position);
				buffer = a + b + c;
				// Turn the 24 bits into four chunks of 6 bits each, and append the
				// matching character for each of them to the output.
				output += (
					TABLE.charAt(buffer >> 18 & 0x3F) +
					TABLE.charAt(buffer >> 12 & 0x3F) +
					TABLE.charAt(buffer >> 6 & 0x3F) +
					TABLE.charAt(buffer & 0x3F)
				);
			}
	
			if (padding == 2) {
				a = input.charCodeAt(position) << 8;
				b = input.charCodeAt(++position);
				buffer = a + b;
				output += (
					TABLE.charAt(buffer >> 10) +
					TABLE.charAt((buffer >> 4) & 0x3F) +
					TABLE.charAt((buffer << 2) & 0x3F) +
					'='
				);
			} else if (padding == 1) {
				buffer = input.charCodeAt(position);
				output += (
					TABLE.charAt(buffer >> 2) +
					TABLE.charAt((buffer << 4) & 0x3F) +
					'=='
				);
			}
	
			return output;
		};
	
		var base64 = {
			'encode': encode,
			'decode': decode,
			'version': '0.1.0'
		};
	
		// Some AMD build optimizers, like r.js, check for specific condition patterns
		// like the following:
		if (
			true
		) {
			!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
				return base64;
			}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		}	else if (freeExports && !freeExports.nodeType) {
			if (freeModule) { // in Node.js or RingoJS v0.8.0+
				freeModule.exports = base64;
			} else { // in Narwhal or RingoJS v0.7.0-
				for (var key in base64) {
					base64.hasOwnProperty(key) && (freeExports[key] = base64[key]);
				}
			}
		} else { // in Rhino or a web browser
			root.base64 = base64;
		}
	
	}(this));
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)(module), (function() { return this; }())))

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ }
/******/ ])
});
;
//# sourceMappingURL=timekit.js.map