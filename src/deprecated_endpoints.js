module.exports = function (TK) {

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
   * Create a findtime filtercollection
   * @type {Function}
   * @return {Promise}
   */
  TK.createFindTimeFilterCollection = function(data) {

    return TK.makeRequest({
      url: '/findtime/filtercollections',
      method: 'post',
      data: data
    });

  };

  /**
   * Get findtime filtercollections
   * @type {Function}
   * @return {Promise}
   */
  TK.getFindTimeFilterCollections = function() {

    return TK.makeRequest({
      url: '/findtime/filtercollections',
      method: 'get'
    });

  };

  /**
   * Update a findtime filtercollections
   * @type {Function}
   * @return {Promise}
   */
  TK.updateFindTimeFilterCollection = function(data) {

    var id = data.id;
    delete data.id;

    return TK.makeRequest({
      url: '/findtime/filtercollections/' + id,
      method: 'get',
      data: data
    });

  };

  return TK;

}
