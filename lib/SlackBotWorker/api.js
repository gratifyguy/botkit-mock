/**
 * Does nothing. Takes no params, returns nothing. It's a no-op!
 */
function noop() {
}

/**
 * Returns an interface to the Slack API in the context of the given bot
 *
 * @param {Object} botkit The botkit bot object
 * @param {Object} config A config containing auth credentials.
 * @returns {Object} A callback-based Slack API interface.
 */
module.exports = function (botkit, config, storage) {
	var api = {
		logByKey: {},
	};

	api.setFilter = function (key, filter) {
		storage.setFilter(key, filter);
	};

	api.setData = function (key, data) {
		storage.setData(key, data);
	};

	api.getData = function (key) {
		return storage.getData(key);
	};

	// Slack API methods: https://api.slack.com/methods
	var slackApiMethods = [
		'auth.test',
		'oauth.access',
		'channels.archive',
		'channels.create',
		'channels.history',
		'channels.info',
		'channels.invite',
		'channels.join',
		'channels.kick',
		'channels.leave',
		'channels.list',
		'channels.mark',
		'channels.rename',
		'channels.replies',
		'channels.setPurpose',
		'channels.setTopic',
		'channels.unarchive',
		'chat.delete',
		'chat.postMessage',
		'chat.postEphemeral',
		'chat.update',
		'chat.unfurl',
		'conversations.archive',
		'conversations.close',
		'conversations.create',
		'conversations.history',
		'conversations.info',
		'conversations.invite',
		'conversations.join',
		'conversations.kick',
		'conversations.leave',
		'conversations.list',
		'conversations.members',
		'conversations.open',
		'conversations.rename',
		'conversations.replies',
		'conversations.setPurpose',
		'conversations.setTopic',
		'conversations.unarchive',
		'dialog.open',
		'dnd.endDnd',
		'dnd.endSnooze',
		'dnd.info',
		'dnd.setSnooze',
		'dnd.teamInfo',
		'emoji.list',
		'files.delete',
		'files.info',
		'files.list',
		'files.upload',
		'files.sharedPublicURL',
		'groups.archive',
		'groups.close',
		'groups.create',
		'groups.createChild',
		'groups.history',
		'groups.info',
		'groups.invite',
		'groups.kick',
		'groups.leave',
		'groups.list',
		'groups.mark',
		'groups.open',
		'groups.rename',
		'groups.replies',
		'groups.setPurpose',
		'groups.setTopic',
		'groups.unarchive',
		'im.close',
		'im.history',
		'im.list',
		'im.mark',
		'im.open',
		'im.replies',
		'mpim.close',
		'mpim.history',
		'mpim.list',
		'mpim.mark',
		'mpim.open',
		'mpim.replies',
		'pins.add',
		'pins.list',
		'pins.remove',
		'reactions.add',
		'reactions.get',
		'reactions.list',
		'reactions.remove',
		'reminders.add',
		'reminders.complete',
		'reminders.delete',
		'reminders.info',
		'reminders.list',
		'rtm.start',
		'rtm.connect',
		'search.all',
		'search.files',
		'search.messages',
		'stars.add',
		'stars.list',
		'stars.remove',
		'team.accessLogs',
		'team.info',
		'team.billableInfo',
		'team.integrationLogs',
		'team.profile.get',
		'usergroups.create',
		'usergroups.disable',
		'usergroups.enable',
		'usergroups.list',
		'usergroups.update',
		'usergroups.users.list',
		'usergroups.users.update',
		'users.getPresence',
		'users.info',
		'users.identity',
		'users.list',
		'users.setActive',
		'users.setPresence',
		'users.deletePhoto',
		'users.identity',
		'users.setPhoto',
		'users.profile.get',
		'users.profile.set'
	];

	/**
	 * Calls Slack using a Token for authentication/authorization
	 *
	 * @param {string} command The Slack API command to call
	 * @param {Object} data The data to pass to the API call
	 * @param {function} cb A NodeJS-style callback
	 */
	api.callAPI = function (command, data, cb, multipart) {
		if (!data.token) {
			data.token = config.token;
		}

		botkit.log(command, data);
		postForm(command, data, cb, multipart);
	};

	/**
	 * Calls Slack using OAuth for authentication/authorization
	 *
	 * @param {string} command The Slack API command to call
	 * @param {Object} data The data to pass to the API call
	 * @param {function} cb A NodeJS-style callback
	 */
	api.callAPIWithoutToken = function (command, data, cb) {
		if (!data.client_id) {
			data.client_id = botkit.config.clientId;
		}
		if (!data.client_secret) {
			data.client_secret = botkit.config.clientSecret;
		}
		if (!data.redirect_uri) {
			data.redirect_uri = botkit.config.redirectUri;
		}

		// DON'T log options: that could expose the client secret!
		postForm(command, data, cb);
	};

	// generate all API methods
	slackApiMethods.forEach(function (slackMethod) {
		// most slack api methods are only two parts, of the form group.method, e.g. auth.tests
		// some have three parts: group.subgroup.method, e.g, users.profile.get
		// this method loops through all groups in a method, ensures they exist,
		// then adds the method to the terminal group

		var groups = slackMethod.split('.');
		var method = groups.pop();
		var currentGroup = api;

		groups.forEach(function (nextGroupName) {
			if (!currentGroup[nextGroupName]) {
				currentGroup[nextGroupName] = {};
			}
			currentGroup = currentGroup[nextGroupName];
		});

		currentGroup[method] = function (options, cb) {
			api.callAPI(slackMethod, options, cb);
		};

	});

	return api;

	/**
	 * Makes a POST request as a form to the given url with the options as data
	 *
	 * @param {string} url The URL to POST to
	 * @param {Object} formData The data to POST as a form
	 * @param {function=} cb An optional NodeJS style callback when the POST completes or errors out.
	 */
	function postForm(url, formData, cb, multipart) {
		cb = cb || noop;

		botkit.debug('** API CALL: ' + url);

		if (Array.isArray(api.logByKey[url])) {
			api.logByKey[url].push(formData);
		} else {
			api.logByKey[url] = [formData];
		}

		storage.process(url, formData, cb);
	}
};
