var utils = require('./utils');

module.exports = function (TK) {
	/**
	 * Get user's connected accounts
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.getAccounts = function () {
		return TK.makeRequest({
			url: '/accounts',
			method: 'get',
		});
	};

	/**
	 * Initiate a Google account sync
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.accountGoogleSync = function () {
		return TK.makeRequest({
			url: '/accounts/sync',
			method: 'post',
		});
	};

	/**
	 * Initiate a Microsoft account sync
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.accountMicrosoftSync = function () {
		return TK.makeRequest({
			url: '/accounts/microsoft/sync',
			method: 'post',
		});
	};

	/**
	 * Authenticate a user to retrive API token for future calls
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.auth = function (data) {
		var r = TK.makeRequest({
			data: data,
			url: '/auth',
			method: 'post',
		});

		r.then(function (response) {
			var token = response.data.api_token || response.data.apiToken;
			TK.setUser(response.data.email, token);
		}).catch(function (error) {
			TK.setUser('', '');
		});

		return r;
	};

	/**
	 * Get list of apps
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.getApps = function () {
		return TK.makeRequest({
			url: '/apps',
			method: 'get',
		});
	};

	/**
	 * Get settings for a specific app
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.getApp = function () {
		return TK.makeRequest({
			url: '/app',
			method: 'get',
		});
	};

	/**
	 * Create a new Timekit app
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.createApp = function (data) {
		return TK.makeRequest({
			url: '/apps',
			method: 'post',
			data: data,
		});
	};

	/**
	 * Update settings for a specific app
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.updateApp = function (data) {
		var slug = data.slug;
		delete data.slug;

		return TK.makeRequest({
			url: '/apps/' + slug,
			method: 'put',
			data: data,
		});
	};

	/**
	 * Delete an app
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.deleteApp = function (data) {
		return TK.makeRequest({
			url: '/apps/' + data.slug,
			method: 'delete',
		});
	};

	/**
	 * Fetch current resource data from server
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.getResources = function () {
		return TK.makeRequest({
			url: '/resources',
			method: 'get',
		});
	};

	/**
	 * Fetch current resource data from server
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.getResource = function (data) {
		return TK.makeRequest({
			url: '/resources/' + data.id,
			method: 'get',
		});
	};

	/**
	 * Create a new resource with the given properties
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.createResource = function (data) {
		return TK.makeRequest({
			url: '/resources',
			method: 'post',
			data: data,
		});
	};

	/**
	 * Fetch current resource data from server
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.updateResource = function (data) {
		var id = data.id;
		delete data.id;

		return TK.makeRequest({
			url: '/resources/' + id,
			method: 'put',
			data: data,
		});
	};

	/**
	 * Delete a resource with the given properties
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.deleteResource = function (data) {
		return TK.makeRequest({
			url: '/resources/' + data.id,
			method: 'delete',
			data: data,
		});
	};

	/**
	 * Reset password for a resource
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.resetResourcePassword = function (data) {
		return TK.makeRequest({
			url: '/resources/resetpassword',
			method: 'post',
			data: data,
		});
	};

	/**
	 * Get a specific resource's timezone
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.getResourceTimezone = function (data) {
		return TK.makeRequest({
			url: '/resources/timezone/' + data.email,
			method: 'get',
		});
	};

	/**
	 * Get users calendars that are present on Timekit (synced from providers)
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.getCalendars = function () {
		return TK.makeRequest({
			url: '/calendars',
			method: 'get',
		});
	};

	/**
	 * Get users calendars that are present on Timekit (synced from providers)
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.getCalendar = function (data) {
		return TK.makeRequest({
			url: '/calendars/' + data.id,
			method: 'get',
		});
	};

	/**
	 * Create a new calendar for current user
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.createCalendar = function (data) {
		return TK.makeRequest({
			url: '/calendars/',
			method: 'post',
			data: data,
		});
	};

	/**
	 * Update a calendar for current user
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.updateCalendar = function (data) {
		var id = data.id;
		delete data.id;

		return TK.makeRequest({
			url: '/calendars/' + id,
			method: 'put',
			data: data,
		});
	};

	/**
	 * Delete a calendar
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.deleteCalendar = function (data) {
		return TK.makeRequest({
			url: '/calendars/' + data.id,
			method: 'delete',
		});
	};

	/**
	 * Get all user's events
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.getEvents = function (data) {
		return TK.makeRequest({
			url: '/events',
			method: 'get',
			params: data,
		});
	};

	/**
	 * Get a user's event by ID
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.getEvent = function (data) {
		return TK.makeRequest({
			url: '/events/' + data.id,
			method: 'get',
		});
	};

	/**
	 * Create a new event
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.createEvent = function (data) {
		return TK.makeRequest({
			url: '/events',
			method: 'post',
			data: data,
		});
	};

	/**
	 * Update an existing event
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.updateEvent = function (data) {
		var id = data.id;
		delete data.id;

		return TK.makeRequest({
			url: '/events/' + id,
			method: 'put',
			data: data,
		});
	};

	/**
	 * Delete a user's event by ID
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.deleteEvent = function (data) {
		return TK.makeRequest({
			url: '/events/' + data.id,
			method: 'delete',
		});
	};

	/**
	 * Find mutual availability across multiple users/calendars
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.findTime = function (data) {
		return TK.makeRequest({
			url: '/findtime',
			method: 'post',
			data: data,
		});
	};

	/**
	 * Find bulk availability across multiple users/calendars
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.findTimeBulk = function (data) {
		return TK.makeRequest({
			url: '/findtime/bulk',
			method: 'post',
			data: data,
		});
	};

	/**
	 * Find team availability across multiple users/calendars
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.findTimeTeam = function (data) {
		return TK.makeRequest({
			url: '/findtime/team',
			method: 'post',
			data: data,
		});
	};

	/**
	 * Fetch availability on the new availability endpoint (successor to findtime)
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.fetchAvailability = function (data) {
		return TK.makeRequest({
			url: '/availability',
			method: 'post',
			data: data,
		});
	};

	/**
	 * Get all user auth credentials
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.getCredentials = function () {
		return TK.makeRequest({
			url: '/credentials',
			method: 'get',
		});
	};

	/**
	 * Create a new pair of auth credentials
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.createCredential = function (data) {
		return TK.makeRequest({
			url: '/credentials',
			method: 'post',
			data: data,
		});
	};

	/**
	 * Delete a pair of auth credentials
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.deleteCredential = function (data) {
		return TK.makeRequest({
			url: '/credentials/' + data.id,
			method: 'delete',
		});
	};

	/**
	 * Get all bookings
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.getBookings = function () {
		return TK.makeRequest({
			url: '/bookings',
			method: 'get',
		});
	};

	/**
	 * Get specific booking
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.getBooking = function (data) {
		return TK.makeRequest({
			url: '/bookings/' + data.id,
			method: 'get',
		});
	};

	/**
	 * Create a new booking
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.createBooking = function (data) {
		return TK.makeRequest({
			url: '/bookings',
			method: 'post',
			data: data,
		});
	};

	/**
	 * Create bookings in bulk
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.createBookingsBulk = function (data) {
		return TK.makeRequest({
			url: '/bookings/bulk',
			method: 'post',
			data: data,
		});
	};

	/**
	 * Update an existing booking
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.updateBooking = function (data) {
		var id = data.id;
		delete data.id;

		var action = data.action;
		delete data.action;

		return TK.makeRequest({
			url: '/bookings/' + id + '/' + action,
			method: 'put',
			data: data,
		});
	};

	/**
	 * Delete specific booking
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.deleteBooking = function (data) {
		var id = data.id;
		delete data.id;

		return TK.makeRequest({
			url: '/bookings/' + id,
			method: 'delete',
		});
	};

	/**
	 * Update an bookings in bulk
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.updateBookingsBulk = function (data) {
		return TK.makeRequest({
			url: '/bookings/bulk',
			method: 'put',
			data: data,
		});
	};

	/**
	 * Get all bookings
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.getGroupBookings = function () {
		return TK.makeRequest({
			url: '/bookings/groups',
			method: 'get',
		});
	};

	/**
	 * Get specific booking
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.getGroupBooking = function (data) {
		return TK.makeRequest({
			url: '/bookings/groups/' + data.id,
			method: 'get',
		});
	};

	/**
	 * Get all projects
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.getProjects = function () {
		return TK.makeRequest({
			url: '/projects',
			method: 'get',
		});
	};

	/**
	 * Get a project
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.getProject = function (data) {
		return TK.makeRequest({
			url: '/projects/' + data.id,
			method: 'get',
		});
	};

	/**
	 * Get a project for public use on hosted page
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.getHostedProject = function (data) {
		return TK.makeRequest({
			url: '/projects/hosted/' + data.slug,
			method: 'get',
		});
	};

	/**
	 * Get a project for embedding on website
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.getEmbedProject = function (data) {
		return TK.makeRequest({
			url: '/projects/embed/' + data.id,
			method: 'get',
		});
	};

	/**
	 * Create a new project
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.createProject = function (data) {
		return TK.makeRequest({
			url: '/projects',
			method: 'post',
			data: data,
		});
	};

	/**
	 * Update an existing project
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.updateProject = function (data) {
		var id = data.id;
		delete data.id;

		return TK.makeRequest({
			url: '/projects/' + id,
			method: 'put',
			data: data,
		});
	};

	/**
	 * Delete a project
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.deleteProject = function (data) {
		return TK.makeRequest({
			url: '/projects/' + data.id,
			method: 'delete',
		});
	};

	/**
	 * Add a resource to a project
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.addProjectResource = function (data) {
		var id = data.id;
		delete data.id;

		return TK.makeRequest({
			url: '/projects/' + id + '/resources',
			method: 'post',
			data: data,
		});
	};

	/**
	 * Get resources for a project
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.getProjectResources = function (data) {
		var id = data.id;
		delete data.id;

		return TK.makeRequest({
			url: '/projects/' + id + '/resources',
			method: 'get',
		});
	};

	/**
	 * Set resources for a project
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.setProjectResources = function (data) {
		var id = data.id;
		delete data.id;

		return TK.makeRequest({
			url: '/projects/' + id + '/resources',
			method: 'put',
			data: data.resources,
		});
	};

	/**
	 * Remove a resource from a project
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.removeProjectResource = function (data) {
		return TK.makeRequest({
			url: '/projects/' + data.id + '/resources/' + data.resourceId,
			method: 'delete',
		});
	};

	/**
	 * Get all location services
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.getServices = function () {
		return TK.makeRequest({
			url: '/location/services',
			method: 'get',
		});
	};

	/**
	 * Get all locations
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.getService = function () {
		return TK.makeRequest({
			url: '/location/services/' + data.id,
			method: 'get',
		});
	};

	/**
	 * Create a new location
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.createService = function (data) {
		return TK.makeRequest({
			url: '/location/services',
			method: 'post',
			data: data,
		});
	};
	

	/**
	 * Update an existing location
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.updateService = function (data) {
		var id = data.id;
		delete data.id;

		return TK.makeRequest({
			url: '/location/services/' + id,
			method: 'put',
			data: data,
		});
	};

	/**
	 * Delete a location
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.deleteService = function (data) {
		return TK.makeRequest({
			url: '/location/services/' + data.id,
			method: 'delete',
		});
	};
	
	/**
	 * Get all locations
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.getLocations = function () {
		return TK.makeRequest({
			url: '/locations',
			method: 'get',
		});
	};
	
	/**
	 * Get a location
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.getLocation = function (data) {
		return TK.makeRequest({
			url: '/locations/' + data.id,
			method: 'get',
		});
	};
	
	/**
	 * Create a new location
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.createLocation = function (data) {
		return TK.makeRequest({
			url: '/locations',
			method: 'post',
			data: data,
		});
	};

	/**
	 * Update an existing location
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.updateLocation = function (data) {
		var id = data.id;
		delete data.id;

		return TK.makeRequest({
			url: '/locations/' + id,
			method: 'put',
			data: data,
		});
	};

	/**
	 * Delete a location
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.deleteLocation = function (data) {
		return TK.makeRequest({
			url: '/locations/' + data.id,
			method: 'delete',
		});
	};

	/**
	 * Get a location projects
	 * 
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.getLocationProjects = function (id) {
		return TK
		.carry({
			params: {
			  search: 'locations.uuid:' + id
			}
		}).makeRequest({
			method: 'get',
			url: '/projects',
		});
	};

	/**
	 * Get a service projects
	 * 
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.getServiceProjects = function (id) {
		return TK
		.carry({
			params: {
				search: 'services.uuid:' + id
			}
		}).makeRequest({
			method: 'get',
			url: '/projects',
		});
	};

	/**
	 * Get a service projects
	 * 
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.getLocationServiceProjects = function (locationUuid, serviceUuid) {
		return TK
		.carry({
			params: {
				search: 'locations.uuid:' + locationUuid + ';services.uuid:' + serviceUuid
			}
		}).makeRequest({
			method: 'get',
			url: '/projects',
		});
	};
	
	/**
	 * Endpoint that returns all available dates for given resource.
	 * 
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.fetchAvailabilityDates = function (data) {
		return TK.makeRequest({
			url: '/availability/dates',
			method: 'post',
			data: data,
		});
	};

	/**
	 * The ability to easily show a total number of available time slots.
	 * 
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.fetchAvailabilityCounts = function (data) {
		return TK.makeRequest({
			url: '/availability/count',
			method: 'post',
			data: data,
		});
	};

	/**
	 * The ability to easily show a total number of available time slots.
	 * 
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.fetchUnAvailableSlots = function (data) {
		return TK.makeRequest({
			url: '/unavailable/slots',
			method: 'post',
			data: data,
		});
	};

	/**
	 * Reserve a booking
	 * 
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.reserveBooking = function (data) {
		return TK.makeRequest({
			url: '/bookings/reserve',
			method: 'post',
			data: data,
		});
	};

	/**
	 * Extend reserved booking
	 * 
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.extendReservedBooking = function (data) {
		return TK.makeRequest({
			url: '/bookings/reserve/extend',
			method: 'put',
			data: data,
		});
	};

	/**
	 * List email templates
	 * 
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.getEmailTemplates = function () {
		return TK.makeRequest({
			url: '/templates',
			method: 'get',
		});
	};

	/**
	 * Get Specific email template
	 * 
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.getEmailTemplate = function (slug) {
		return TK.makeRequest({
			method: 'get',
			url: '/templates/' + slug,
		});
	};

	/**
	 * Update an existing email template
	 * 
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.updateEmailTemplate = function (data) {
		var slug = data.slug;
		delete data.slug;

		return TK.makeRequest({
			url: '/templates/' + slug,
			method: 'put',
			data: data,
		});
	};

	/**
	 * Following endpoint will be used in order to reschedule a booking.
	 * 
	 * @type {Function}
	 * @return {Promise}
	 */
	TK.rescheduleBooking = function (data) {
		var id = data.id;
		delete data.id;

		return TK.makeRequest({
			url: '/bookings/' + id + '/reschedule/',
			method: 'post',
			data: data,
		});
	};

	return TK;
};
