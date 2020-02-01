'use strict';
const assert = require('assert');
const {BotMock, SlackApiMock} = require('../../lib');

const {SlackAdapter, SlackMessageTypeMiddleware, SlackEventMiddleware} = require('botbuilder-adapter-slack/lib/index');

describe('Slack API responses', function () {
	beforeEach(async () => {
		const adapter = new SlackAdapter(SlackApiMock.slackAdapterMockParams);

		adapter.use(new SlackEventMiddleware());
		adapter.use(new SlackMessageTypeMiddleware());

		this.controller = new BotMock({
			adapter: adapter,
			disable_webserver: true
		});

		SlackApiMock.bindMockApi(this.controller);

		this.bot = await this.controller.spawn();
	});

	describe('default responses', () => {
		it('should return data.ok for users.list call', async () => {
			const response = await this.bot.api.users.list();
			assert.strictEqual(response.ok, true);
		});

		it('should return data.ok for channels.info call', async () => {
			const response = await this.bot.api.channels.info({});
			assert.deepStrictEqual(response.ok, true);
		});
	});

	describe('change response data for actions', () => {
		describe('success response', () => {
			const usersListResponse = {
				ok: true,
				members: [{id: '2'}]
			};
			const channelsInfoResponse = {
				ok: true,
				channel1: {id: '2'}
			};

			beforeEach(() => {
				this.controller.axiosMockAdapter.onPost('users.list').reply(200, usersListResponse);
				this.controller.axiosMockAdapter.onPost('channels.info').reply(200, channelsInfoResponse);
			});

			it('should return newly changed api data in users.list call', async () => {
				const response = await this.bot.api.users.list();
				assert.deepStrictEqual(response, usersListResponse);
			});

			it('should return newly changed api data in channels.info call', async () => {
				const response = await this.bot.api.channels.info();
				assert.deepStrictEqual(response, channelsInfoResponse);
			});
		});

		describe('error response', () => {
			const usersListResponse = {
				ok: false,
				error: 'not_authed'
			};
			const channelsInfoResponse = {
				ok: false,
				error: 'channel_not_found'
			};

			beforeEach(() => {
				this.controller.axiosMockAdapter.onPost('users.list').reply(200, usersListResponse);
				this.controller.axiosMockAdapter.onPost('channels.info').reply(200, channelsInfoResponse);
			});

			it('should return newly changed api data in users.list call', async () => {
				let error = '';
				try {
					await this.bot.api.users.list()
				} catch (err) {
					error = err;
				}
				assert.strictEqual(error.toString(), 'Error: An API error occurred: not_authed');
				assert.deepStrictEqual(error.data, usersListResponse);
			});

			it('should return newly changed api data in channels.info call', async () => {
				let error = '';
				try {
					await this.bot.api.channels.info()
				} catch (err) {
					error = err;
				}
				assert.strictEqual(error.toString(), 'Error: An API error occurred: channel_not_found');
				assert.deepStrictEqual(error.data, channelsInfoResponse);
			});
		});
	});
});
