'use strict';
const assert = require('assert');
const Botmock = require('../../lib/Botmock');
const logicBeingTested = function (controller) {
	controller.hears('whisper', ['direct_message'], function (bot, message) {
		bot.whisper(message, 'ola');
	})
}

describe('bot.whisper', () => {
	afterEach(() => {
		//clean up botkit tick interval
		this.controller.shutdown();
	});

	beforeEach(() => {
		this.userInfo = {
			slackId: 'user123',
			channel: 'channel123',
		};

		this.sequence = [
			{
				user: this.userInfo.slackId, //user required for each direct message
				channel: this.userInfo.channel, // user channel required for direct message
				messages: [
					{
						text: 'whisper',
						isAssertion: true,
					}
				]
			}
		];
		this.controller = Botmock({
			debug: false,
			log: false,
		});

		this.bot = this.controller.spawn({
			type: 'slack',
		});

		logicBeingTested(this.controller);
	});

	it('should return ola', () => {
		return this.bot.usersInput(this.sequence).then(({text}) => {
			return assert.equal(text, 'ola');
		}).catch((err) => {
			console.error(err);
		});
	});
});

