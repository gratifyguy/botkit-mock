'use strict';
const {Botkit} = require('botkit');
const {TurnContext} = require('botbuilder');
const {setTimeoutAsync} = require('./utils');

class BotMock extends Botkit {
	static get defaultFields() {
		return {
			CHANNEL: 'BotMock-default-channel',
			TEAM: 'BotMock-default-channel',
			MESSAGE_TYPE: 'direct_message'
		}
	}

	constructor(config) {
		// try to disable botkit warning if config has no disable_console property
		if(!(config).hasOwnProperty('disable_console')){
			config.disable_console = true;
		}
		// try to disable botkit server if config has no disable_webserver property
		if(!(config).hasOwnProperty('disable_webserver')){
			config.disable_webserver = true;
		}
		super(config);
		this.detailed_answers = {};
		this.adapter._originSendActivities = this.adapter.sendActivities;
		this.adapter.sendActivities = this._sendActivities.bind(this);
	}

	/**
	 * Override of botkit.adapter.sendActivities to track history of sent messages.
	 * The function must be async because original fn botkit.adapter.sendActivities
	 * returns promise.
	 * @param context
	 * @param activities
	 * @returns {Promise<void>}
	 * @private
	 */
	async _sendActivities(context, activities) {
		for (let activity of activities) {
			if (Array.isArray(this.detailed_answers[activity.conversation.id])) {
				this.detailed_answers[activity.conversation.id].push(activity);
			} else {
				this.detailed_answers[activity.conversation.id] = [activity];
			}
		}
	}

	/**
	 * The function interpolate sequence of messages into events for botkit.
	 * @param userSequences
	 * @returns {Promise<void>}
	 */
	async usersInput(userSequences) {
		const {defaultFields} = this.constructor;

		for (let userSequence of userSequences) {
			for (let message of userSequence.messages) {
				// build activity in botkit format
				const activity = {
					id: message.id || null,
					timestamp: new Date(),
					channelId: 'slack',
					conversation: {
						id: message.channel || userSequence.channel || defaultFields.CHANNEL,
						team: message.team || userSequence.team || defaultFields.TEAM,
						thread_ts: message.thread_ts || null
					},
					from: {id: userSequence.user || message.user || null},
					recipient: {id: message.recipient},
					channelData: {
						botkitEventType: message.type || userSequence.type || defaultFields.MESSAGE_TYPE,
						...message
					},
					text: message.text,
					type: 'event'
				};


				const waitBefore = message.timeout || message.waitBefore || 0;
				if (waitBefore > 0) {
					await setTimeoutAsync(waitBefore);
				}

				const context = new TurnContext(this.adapter, activity);
				await this.adapter.runMiddleware(context, this.handleTurn.bind(this));


				const waitAfter = message.waitAfter || 0;
				if (waitAfter > 0) {
					await setTimeoutAsync(waitAfter);
				}

				if (message.isAssertion) {
					const messagesLog = this.detailed_answers[activity.conversation.id];
					let result = {};
					if (messagesLog) {
						const deepIndex = messagesLog.length - 1 - (message.deep || 0);
						result = messagesLog[deepIndex];
					}
					return result;
				}
			}
		}

		throw new Error("isAssert is missed in message sequence");
	}
}

module.exports = BotMock;