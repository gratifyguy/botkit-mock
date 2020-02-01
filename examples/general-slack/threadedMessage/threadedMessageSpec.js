'use strict';
const assert = require('assert');
const {BotMock, SlackApiMock} = require('../../../lib');
const {SlackAdapter, SlackMessageTypeMiddleware, SlackEventMiddleware} = require('botbuilder-adapter-slack');
const fileBeingTested = require('./threadedMessage');

describe('message in a thread', () => {
	const initController = () => {
		const adapter = new SlackAdapter(SlackApiMock.slackAdapterMockParams);
		adapter.use(new SlackEventMiddleware());
		adapter.use(new SlackMessageTypeMiddleware());

		this.controller = new BotMock({
			adapter: adapter,
		});

		SlackApiMock.bindMockApi(this.controller);

		fileBeingTested(this.controller);
	};

	beforeEach(() => {
		this.userInfo = {
			slackId: 'user123',
			channel: 'channel123',
		};
	});

	describe('create_service', () => {
		beforeEach(() => {
			initController();
		});
		it(`should reply in a correct sequence through message`, async () => {
			await this.controller.usersInput([
				{
					type: 'message',
					user: this.userInfo.slackId, //user required for each direct message
					channel: this.userInfo.channel, // user channel required for direct message
					messages: [
						{
							text: 'create_service',
							isAssertion: true,
						}
					]
				}
			]);

			assert.strictEqual(this.controller.detailed_answers[this.userInfo.channel][0].text, `Howdy!`);
		});
	});
});