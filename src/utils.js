var base64 = require('base-64');
var merge = require('deepmerge');

module.exports = {

  /**
   * Generate base64 string for basic auth purposes
   * @type {Function}
   * @return {String}
   */
  encodeAuthHeader: function(email, token) {
    return base64.encode(email + ':' + token);
  },

  /**
   * Retrieve metadata from response.data object and save it on response.metaData instead
   * @type {Function}
   * @return {String}
   */
  copyResponseMetaData: function(response) {
    if (Object.keys(response.data).length > 1) {
      response.metaData = {}
      Object.keys(response.data).forEach(function(key) {
        if (key !== 'data') response.metaData[key] = response.data[key]
      })
    }
    response.data = response.data.data;
    return response
  },

  /**
   * Add the carried payload for next request to the actual payload
   * @type {Function}
   * @return {String}
   */
  mergeNextPayload: function (args, nextPayload) {
    if (Object.keys(nextPayload).length === 0) return args
    // Merge potential query string params manually
    if (nextPayload.params && args.params) {
      var nextParams = nextPayload.params
      for (var param in nextParams) {
        if (typeof args.params[param] !== 'undefined') {
          args.params[param] += (';' + nextParams[param])
        }
      }
    }
    args = merge(nextPayload, args)
    return args
  },

  /**
   * Build absolute URL for API call
   * @type {Function}
   * @return {String}
   */
  buildUrl: function(endpoint, config) {
    return config.apiBaseUrl + config.apiVersion + endpoint;
  }

}
